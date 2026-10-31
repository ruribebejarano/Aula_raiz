"""Generador de cuentos (Comunicacion) y situaciones-problema con numeros
reales (Matematica) para el modo demostracion de BIBLIOTECA IA.

No usa un modelo de lenguaje: combina bancos de personajes, lugares y
estructuras narrativas de forma determinista (misma entrada -> mismo
resultado, salvo que cambie el parametro `variant`, pensado para el boton
"Generar otra version" del frontend). La meta es que el contenido se sienta
especifico y util para el aula, no un parrafo generico repetido.

Para Matematica, el problema incluye cantidades y operacion reales con una
respuesta calculada (respuesta_clave), no solo ambientacion.
"""
from __future__ import annotations

import random

CHARACTERS = [
    ("Rosa", "ella"),
    ("Mario", "el"),
    ("Juana", "ella"),
    ("Tomas", "el"),
    ("Elena", "ella"),
    ("Pedro", "el"),
    ("Flor", "ella"),
    ("Lucas", "el"),
    ("Nayra", "ella"),
    ("Wilson", "el"),
    ("Yolanda", "ella"),
    ("Cesar", "el"),
]

DEFAULT_PLACES = [
    "la chacra de la comunidad",
    "el rio cercano",
    "la feria del pueblo",
    "el corral de animales",
    "el camino a la escuela",
    "el cerro detras del colegio",
]

STORY_OPENERS = [
    "Esta semana, {personaje} ayudaba en {lugar} cuando algo llamo su atencion relacionado con '{tema}'.",
    "{personaje} siempre prestaba atencion en {lugar}, y hoy queria entender mejor '{tema}'.",
    "En {lugar}, {personaje} escucho a los mayores hablar sobre '{tema}' y se acerco a preguntar.",
    "Antes de ir a la escuela, {personaje} paso por {lugar} y encontro algo que tenia que ver con '{tema}'.",
]

STORY_MIDDLES = [
    "Al principio no entendia bien como funcionaba, asi que decidio observar con calma y hacer preguntas.",
    "Le costo un poco al inicio, pero recordo lo que habian conversado en el aula sobre el tema.",
    "Entonces penso en pedir ayuda a alguien con mas experiencia, para no quedarse con la duda.",
    "Decidio probar por su cuenta primero, fijandose en los detalles antes de sacar una conclusion.",
]

STORY_ENDINGS = [
    "Al final, {personaje} logro entenderlo y se lo explico a otro companero del aula multigrado.",
    "Gracias a eso, {personaje} pudo terminar la tarea y compartir lo aprendido con su familia.",
    "Cuando lo resolvio, {personaje} se dio cuenta de que lo aprendido en clase si servia en la vida diaria.",
    "{personaje} termino satisfecho, y al dia siguiente conto la experiencia al resto del salon.",
]

PREDICTION_PROMPTS = [
    "Antes de seguir leyendo: ¿que crees que hizo {personaje} despues?",
    "Pausa aqui y pregunta a la clase: ¿como creen que termina esta historia?",
    "Antes de continuar: ¿que harian ustedes en el lugar de {personaje}?",
    "Pregunta para el aula: ¿por que creen que {personaje} se intereso en '{tema}'?",
]

# (cosa en plural, genero de "cosa", lugar de guardado en plural, lugar en singular)
MATH_UNITS = [
    ("papas", "f", "sacos", "saco"),
    ("naranjas", "f", "canastas", "canasta"),
    ("cuyes", "m", "corrales", "corral"),
    ("huevos", "m", "nidos", "nido"),
    ("panes", "m", "bolsas", "bolsa"),
    ("plantones", "m", "filas", "fila"),
]

MATH_PREDICTION_PROMPTS = [
    "Antes de resolver: ¿que datos del problema son importantes para encontrar la respuesta?",
    "Antes de calcular: ¿el resultado sera mayor o menor que la primera cantidad? ¿Por que?",
    "Pregunta para el aula: ¿que operacion usarian para resolver esto, y por que?",
]


def _rng(seed_text: str, variant: int) -> random.Random:
    return random.Random(f"{seed_text}|{variant}")


def generate_story(topic: str, local_context: str | None, variant: int = 0) -> dict[str, str]:
    rng = _rng(topic, variant)
    place = (local_context or "").strip() or rng.choice(DEFAULT_PLACES)
    name, _pronoun = rng.choice(CHARACTERS)

    parte1 = STORY_OPENERS[(len(topic) + variant) % len(STORY_OPENERS)].format(
        personaje=name, lugar=place, tema=topic
    )
    parte2 = STORY_MIDDLES[(len(place) + variant) % len(STORY_MIDDLES)]
    parte3 = STORY_ENDINGS[(len(name) + variant) % len(STORY_ENDINGS)].format(personaje=name)

    texto = f"{parte1} {parte2}\n\n{parte3}"
    pregunta = PREDICTION_PROMPTS[(len(topic) + len(name) + variant) % len(PREDICTION_PROMPTS)].format(
        personaje=name, tema=topic
    )
    return {"texto": texto, "pregunta_interactiva": pregunta, "personaje": name, "lugar": place}


def _infer_operation(topic: str) -> str:
    t = topic.lower()
    if any(w in t for w in ["resta", "diferencia", "quitar", "menos"]):
        return "resta"
    if any(w in t for w in ["multiplic", "veces", "doble", "triple"]):
        return "multiplicacion"
    if any(w in t for w in ["divid", "reparte", "grupos de", "mitad"]):
        return "division"
    return "suma"


def generate_math_situation(
    topic: str, local_context: str | None, grades: list[int] | None, variant: int = 0
) -> dict[str, str]:
    rng = _rng(topic, variant)
    place = (local_context or "").strip() or rng.choice(DEFAULT_PLACES)
    name, _pronoun = rng.choice(CHARACTERS)
    thing, gender, unit, unit_singular = rng.choice(MATH_UNITS)
    cuantos = "Cuantas" if gender == "f" else "Cuantos"

    max_grade = max(grades) if grades else 3
    if max_grade <= 2:
        low, high = 2, 15
    elif max_grade <= 4:
        low, high = 10, 60
    else:
        low, high = 15, 150

    operation = _infer_operation(topic)

    if operation == "suma":
        a, b = rng.randint(low, high), rng.randint(low, high)
        respuesta = a + b
        texto = (
            f"En {place}, {name} junto {a} {thing} por la mañana y {b} {thing} mas por la tarde. "
            f"¿{cuantos} {thing} junto {name} en total?"
        )
    elif operation == "resta":
        a = rng.randint(low + 5, high)
        b = rng.randint(low, a - 1)
        respuesta = a - b
        texto = (
            f"En {place}, {name} tenia {a} {thing} en {unit}. "
            f"Si uso {b} {thing} para compartir con la familia, ¿{cuantos} {thing} le quedan?"
        )
    elif operation == "multiplicacion":
        a = rng.randint(2, 9)
        b = rng.randint(max(2, low // 5), max(3, high // 8))
        respuesta = a * b
        texto = (
            f"En {place}, {name} organizo {a} {unit}, cada {unit_singular} con {b} {thing}. "
            f"¿{cuantos} {thing} hay en total?"
        )
    else:  # division
        groups = rng.randint(2, 6)
        per_group = rng.randint(max(2, low // 3), max(3, high // 6))
        total = groups * per_group
        respuesta = per_group
        texto = (
            f"En {place}, {name} repartio {total} {thing} en partes iguales entre {groups} {unit}. "
            f"¿{cuantos} {thing} hay en cada {unit_singular}?"
        )

    pregunta = MATH_PREDICTION_PROMPTS[(len(topic) + variant) % len(MATH_PREDICTION_PROMPTS)]
    return {
        "texto": texto,
        "pregunta_interactiva": pregunta,
        "respuesta_clave": str(respuesta),
        "operacion": operation,
    }
