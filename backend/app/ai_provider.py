"""Capa de IA intercambiable (AIProvider).

DemoAIProvider: siempre disponible, sin internet ni claves. Genera contenido
mediante plantillas parametrizadas. Es el modo por defecto.

OllamaAIProvider: opcional. Intenta conectarse a un modelo local via la API
de Ollama. Si falla o la respuesta no es JSON valido, retorna al fallback de
DemoAIProvider y así lo informa.

Importante: nunca se envían nombres completos ni datos identificables de
estudiantes al modelo. Solo area, tema, grados y niveles de apoyo.
"""
from __future__ import annotations

import json
import re
from abc import ABC, abstractmethod
from typing import Any

import httpx

from app.config import settings

GRADE_RANGE_LABELS = {
    1: "1er grado",
    2: "2do grado",
    3: "3er grado",
    4: "4to grado",
    5: "5to grado",
    6: "6to grado",
}


def grade_range_label(grades: list[int]) -> str:
    if not grades:
        return "Multigrado"
    ordered = sorted(set(grades))
    labels = [GRADE_RANGE_LABELS.get(g, str(g)) for g in ordered]
    if len(labels) == 1:
        return labels[0]
    return f"{labels[0]} - {labels[-1]}"


class AIGenerationResult:
    def __init__(self, content: dict[str, Any], provider_used: str, note: str = ""):
        self.content = content
        self.provider_used = provider_used
        self.note = note


class AIProvider(ABC):
    @abstractmethod
    def generate_material(self, req: dict[str, Any]) -> AIGenerationResult:
        ...

    @abstractmethod
    def generate_lesson(self, req: dict[str, Any]) -> AIGenerationResult:
        ...

    @abstractmethod
    def status(self) -> dict[str, Any]:
        ...


class DemoAIProvider(AIProvider):
    name = "demo"

    def status(self) -> dict[str, Any]:
        return {
            "provider_active": "demo",
            "message": "Modo demostracion - plantilla local. No requiere internet ni modelo conectado.",
        }

    def _materials_for(self, area: str, available_resources: str | None) -> list[str]:
        base = [
            "Pizarra o superficie para escribir",
            "Cuadernos de los estudiantes",
            "Fichas impresas (blanco y negro)",
        ]
        if area.lower().startswith("mat"):
            base.append("Material concreto disponible: piedritas, semillas o chapitas para contar")
        else:
            base.append("Textos cortos o lecturas de la comunidad disponibles en el aula")
        if available_resources:
            base.append(f"Recursos adicionales indicados por el docente: {available_resources}")
        return base

    def _questions_for(self, area: str, topic: str, level: str) -> list[dict[str, str]]:
        if area.lower().startswith("mat"):
            bank = {
                "Requiere acompanamiento prioritario": [
                    ("Cuenta y escribe cuantos objetos hay en el grupo mostrado.", "Verificar conteo uno a uno; apoyar con material concreto."),
                    ("Ordena estos numeros del menor al mayor.", "Revisar si reconoce el orden; usar recta numerica como apoyo."),
                ],
                "En desarrollo": [
                    (f"Resuelve un problema sencillo de {topic} usando dibujos si lo necesitas.", "Revisar el procedimiento, no solo el resultado."),
                    ("Explica con tus palabras como resolviste el ejercicio anterior.", "Buscar que verbalice el procedimiento."),
                ],
                "Desempeno esperado para esta actividad": [
                    (f"Resuelve dos problemas de {topic} sin apoyo de dibujos.", "Comparar estrategia usada con la esperada para el grado."),
                    ("Crea tu propio problema parecido al del ejercicio 1 y resuelvelo.", "Evaluar coherencia y correccion del problema creado."),
                ],
            }
        else:
            bank = {
                "Requiere acompanamiento prioritario": [
                    ("Lee el texto en voz alta con ayuda del docente y señala las palabras que reconoces.", "Observar fluidez silaba por silaba; no exigir fluidez completa."),
                    ("Dibuja lo que entendiste del texto.", "Revisar si el dibujo se relaciona con el contenido central."),
                ],
                "En desarrollo": [
                    (f"Responde: ¿de que trata principalmente el texto sobre {topic}?", "Revisar si identifica la idea principal."),
                    ("Menciona un personaje o dato importante del texto.", "Verificar comprension literal."),
                ],
                "Desempeno esperado para esta actividad": [
                    (f"Explica con tus palabras el mensaje del texto sobre {topic} y da tu opinion.", "Evaluar comprension inferencial y argumento propio."),
                    ("Escribe un final alternativo o una conclusion breve.", "Evaluar creatividad y coherencia con el texto."),
                ],
            }
        pairs = bank.get(level, bank["En desarrollo"])
        return [{"enunciado": q, "pauta_de_revision": a} for q, a in pairs]

    def _reading_text(self, topic: str, local_context: str | None) -> str:
        place = local_context.strip() if local_context else "la comunidad"
        templates = [
            (
                f"En {place}, las familias se preparan temprano para el dia. Hoy el tema es '{topic}': "
                f"los ninos observan con atencion mientras los mayores explican cada paso, porque saben "
                f"que lo aprendido les sera util mas adelante."
            ),
            (
                f"Cerca de {place} vive Rosa, una niña curiosa a la que le gusta preguntar el porque de "
                f"las cosas. Esta semana descubrio algo relacionado con '{topic}' y quiso compartirlo con "
                f"toda su aula multigrado."
            ),
            (
                f"Cuando llega la epoca de trabajar en {place}, todos colaboran segun su edad. Mientras "
                f"ayudan, los estudiantes practican lo que han aprendido sobre '{topic}', comentando entre "
                f"ellos lo que notan."
            ),
            (
                f"Don Mario camina hacia {place} llevando sus herramientas. En el camino le cuenta a su "
                f"nieto una historia relacionada con '{topic}', y entre los dos van resolviendo las dudas "
                f"que surgen."
            ),
        ]
        idx = (len(topic) + len(place)) % len(templates)
        return templates[idx]

    def _situation_text(self, topic: str, local_context: str | None) -> str:
        place = local_context.strip() if local_context else "la comunidad"
        templates = [
            (
                f"En {place} se organizo una actividad relacionada con '{topic}'. Para resolverla, los "
                f"estudiantes deben usar lo que saben sobre cantidades, orden o comparacion, igual que lo "
                f"haria alguien resolviendo esa misma tarea en la vida diaria."
            ),
            (
                f"Durante la cosecha en {place}, una familia necesita repartir y contar lo que consiguio. "
                f"La situacion de '{topic}' les ayuda a organizar esa informacion de forma ordenada."
            ),
            (
                f"En la feria cerca de {place}, varios puestos venden productos distintos. Resolver el "
                f"problema de '{topic}' ayuda a entender mejor lo que ahi sucede con las cantidades."
            ),
            (
                f"Un grupo de estudiantes de {place} decidio medir y comparar objetos de su entorno para "
                f"practicar '{topic}' antes de aplicarlo en una tarea mas grande."
            ),
        ]
        idx = (len(topic) + len(place)) % len(templates)
        return templates[idx]

    def generate_material(self, req: dict[str, Any]) -> AIGenerationResult:
        area = req["area"]
        topic = req["topic"]
        grades = req.get("grades", [])
        levels = req.get("support_levels") or ["En desarrollo"]
        duration = req.get("duration_minutes", 45)
        available_resources = req.get("available_resources")
        local_context = req.get("local_context")
        is_comunicacion = area.lower().startswith("com")
        texto_o_situacion = (
            self._reading_text(topic, local_context)
            if is_comunicacion
            else self._situation_text(topic, local_context)
        )

        group_activities = []
        all_questions: list[dict[str, str]] = []
        for level in levels:
            group_activities.append(
                {
                    "grupo": level,
                    "actividad": (
                        f"Actividad de {area.lower()} sobre '{topic}' adaptada al nivel '{level}'. "
                        f"Duracion sugerida: {max(10, duration // max(1, len(levels)))} minutos."
                    ),
                }
            )
            all_questions.extend(self._questions_for(area, topic, level))

        content = {
            "titulo": f"Ficha diferenciada: {topic}",
            "area": area,
            "tema": topic,
            "grado_grupo": grade_range_label(grades),
            "proposito": (
                f"Que los estudiantes refuercen la competencia relacionada con '{topic}' en el area de "
                f"{area}, trabajando con actividades adecuadas a su nivel de apoyo actual."
            ),
            "texto_o_situacion": texto_o_situacion,
            "materiales": self._materials_for(area, available_resources),
            "instrucciones": [
                "Organiza a los estudiantes segun el grupo/nivel indicado por NIVELA AI.",
                (
                    "Lee en voz alta el texto presentado arriba (o usa RADIO AULA)."
                    if is_comunicacion
                    else "Presenta la situacion descrita arriba antes de los ejercicios."
                ),
                "Entrega la ficha correspondiente a cada grupo.",
                "Circula entre los grupos para observar el procedimiento, no solo el resultado.",
            ],
            "actividades_por_grupo": group_activities,
            "preguntas": all_questions[:5] if len(all_questions) > 5 else all_questions,
            "adaptacion": {
                "reforzar": "Reduce la cantidad de preguntas y usa material concreto o apoyo visual adicional.",
                "ampliar": "Agrega una pregunta de aplicacion a una situacion nueva de la comunidad.",
            },
            "indicacion_impresion": "Ficha pensada para impresion A4 en blanco y negro, ahorro de tinta.",
            "contexto_local": local_context or "No se indico contexto local adicional.",
            "aviso": "Contenido de demostracion generado por plantilla local. El docente debe revisar antes de aplicar.",
        }
        return AIGenerationResult(content=content, provider_used="demo")

    def generate_lesson(self, req: dict[str, Any]) -> AIGenerationResult:
        area = req["area"]
        topic = req["topic"]
        grades = req.get("grades", [])
        levels = req.get("support_levels") or ["En desarrollo"]
        duration = req.get("duration_minutes", 45)
        local_context = req.get("local_context")
        is_comunicacion = area.lower().startswith("com")
        texto_o_situacion = (
            self._reading_text(topic, local_context)
            if is_comunicacion
            else self._situation_text(topic, local_context)
        )

        per_group_minutes = max(8, duration // max(1, len(levels) + 1))
        content = {
            "titulo": f"Sesion: {topic}",
            "area": area,
            "tema": topic,
            "grado_grupo": grade_range_label(grades),
            "duracion_minutos": duration,
            "proposito": (
                f"Desarrollar la competencia de {area} vinculada a '{topic}', atendiendo a la vez a "
                f"distintos grados y niveles de apoyo presentes en el aula multigrado."
            ),
            "texto_o_situacion": texto_o_situacion,
            "materiales": self._materials_for(area, req.get("available_resources")),
            "momentos": [
                {
                    "momento": "Inicio",
                    "duracion_minutos": per_group_minutes,
                    "descripcion": (
                        f"Presenta el texto/situacion sobre '{topic}' (ver arriba) y recoge saberes previos."
                    ),
                },
                {
                    "momento": "Desarrollo diferenciado",
                    "duracion_minutos": per_group_minutes * len(levels),
                    "descripcion": "Cada grupo trabaja la actividad correspondiente a su nivel de apoyo (ver detalle por grupo).",
                },
                {
                    "momento": "Cierre",
                    "duracion_minutos": per_group_minutes,
                    "descripcion": "Puesta en comun breve, cada grupo comparte un resultado. Registro de observaciones del docente.",
                },
            ],
            "actividades_por_grupo": [
                {
                    "grupo": level,
                    "actividad": f"Actividad de {area.lower()} sobre '{topic}' para el nivel '{level}'.",
                }
                for level in levels
            ],
            "sugerencia_evaluacion": "Registrar en NIVELA AI el resultado de la actividad aplicada para actualizar el seguimiento.",
            "contexto_local": req.get("local_context") or "No se indico contexto local adicional.",
            "aviso": "Contenido de demostracion generado por plantilla local. El docente debe revisar antes de aplicar.",
        }
        return AIGenerationResult(content=content, provider_used="demo")


class OllamaAIProvider(AIProvider):
    name = "ollama"

    def __init__(self):
        self.base_url = settings.ollama_base_url.rstrip("/")
        self.model = settings.ollama_model
        self.fallback = DemoAIProvider()

    def status(self) -> dict[str, Any]:
        reachable = self._check_reachable()
        return {
            "provider_active": "ollama" if reachable else "demo (ollama no disponible)",
            "ollama_reachable": reachable,
            "message": (
                f"Conectado a Ollama en {self.base_url} con modelo {self.model}."
                if reachable
                else f"No se pudo conectar a Ollama en {self.base_url}. Usando modo demostracion."
            ),
        }

    def _check_reachable(self) -> bool:
        try:
            resp = httpx.get(f"{self.base_url}/api/tags", timeout=2.0)
            return resp.status_code == 200
        except Exception:
            return False

    def _extract_json(self, text: str) -> dict[str, Any] | None:
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if not match:
            return None
        try:
            return json.loads(match.group(0))
        except json.JSONDecodeError:
            return None

    def _call_ollama(self, prompt: str) -> dict[str, Any] | None:
        try:
            resp = httpx.post(
                f"{self.base_url}/api/chat",
                json={
                    "model": self.model,
                    "messages": [
                        {
                            "role": "system",
                            "content": (
                                "Eres un asistente pedagogico para docentes de primaria rural multigrado en Peru. "
                                "Responde UNICAMENTE con un objeto JSON valido, sin texto adicional, sin markdown. "
                                "No incluyas nombres de estudiantes reales ni datos personales."
                            ),
                        },
                        {"role": "user", "content": prompt},
                    ],
                    "stream": False,
                    "format": "json",
                },
                timeout=30.0,
            )
            if resp.status_code != 200:
                return None
            data = resp.json()
            raw_content = data.get("message", {}).get("content", "")
            return self._extract_json(raw_content)
        except Exception:
            return None

    def generate_material(self, req: dict[str, Any]) -> AIGenerationResult:
        area = req["area"]
        text_label = (
            "un texto breve de lectura (2 a 4 oraciones, en español sencillo, contextualizado a una "
            "comunidad rural y al tema)"
            if area.lower().startswith("com")
            else "una situacion breve (2 a 4 oraciones) que contextualice el problema en la vida de una "
            "comunidad rural"
        )
        prompt = (
            f"Genera una ficha diferenciada en español para primaria rural multigrado. "
            f"Area: {area}. Tema: {req['topic']}. Grados: {req.get('grades')}. "
            f"Niveles de apoyo presentes: {req.get('support_levels')}. "
            f"Contexto local indicado por el docente: {req.get('local_context') or 'ninguno'}. "
            f"Incluye en 'texto_o_situacion' {text_label}; las preguntas deben referirse a ese texto o "
            "situacion, no ser genericas. "
            "Responde en JSON con claves: titulo, area, tema, grado_grupo, proposito, texto_o_situacion, "
            "materiales (lista), instrucciones (lista), actividades_por_grupo (lista de objetos "
            "grupo/actividad), preguntas (lista de objetos enunciado/pauta_de_revision), adaptacion "
            "(objeto reforzar/ampliar), indicacion_impresion, contexto_local."
        )
        result = self._call_ollama(prompt)
        if result is None:
            fallback = self.fallback.generate_material(req)
            fallback.note = "Ollama no respondio con JSON valido; se uso la plantilla de demostracion."
            return fallback
        result.setdefault("aviso", "Contenido generado por modelo local (Ollama). El docente debe revisarlo antes de aplicarlo.")
        return AIGenerationResult(content=result, provider_used="ollama")

    def generate_lesson(self, req: dict[str, Any]) -> AIGenerationResult:
        area = req["area"]
        text_label = (
            "un texto breve de lectura (2 a 4 oraciones) contextualizado a una comunidad rural"
            if area.lower().startswith("com")
            else "una situacion breve (2 a 4 oraciones) que contextualice el problema en una comunidad rural"
        )
        prompt = (
            f"Genera un plan de sesion en español para primaria rural multigrado. "
            f"Area: {area}. Tema: {req['topic']}. Grados: {req.get('grades')}. "
            f"Duracion total: {req.get('duration_minutes')} minutos. "
            f"Niveles de apoyo presentes: {req.get('support_levels')}. "
            f"Contexto local indicado por el docente: {req.get('local_context') or 'ninguno'}. "
            f"Incluye en 'texto_o_situacion' {text_label}. "
            "Responde en JSON con claves: titulo, area, tema, grado_grupo, duracion_minutos, proposito, "
            "texto_o_situacion, materiales (lista), momentos (lista de objetos "
            "momento/duracion_minutos/descripcion), actividades_por_grupo (lista de objetos "
            "grupo/actividad), sugerencia_evaluacion, contexto_local."
        )
        result = self._call_ollama(prompt)
        if result is None:
            fallback = self.fallback.generate_lesson(req)
            fallback.note = "Ollama no respondio con JSON valido; se uso la plantilla de demostracion."
            return fallback
        result.setdefault("aviso", "Contenido generado por modelo local (Ollama). El docente debe revisarlo antes de aplicarlo.")
        return AIGenerationResult(content=result, provider_used="ollama")


def get_ai_provider() -> AIProvider:
    if settings.ai_provider == "ollama":
        return OllamaAIProvider()
    return DemoAIProvider()
