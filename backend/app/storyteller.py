"""Generador de cuentos (Comunicacion) y situaciones-problema con numeros
reales (Matematica) para el modo demostracion de BIBLIOTECA IA.

No usa un modelo de lenguaje: combina bancos de personajes, lugares y
estructuras narrativas de forma determinista (misma entrada -> mismo
resultado, salvo que cambie el parametro `variant`, pensado para el boton
"Generar otra version" del frontend).

Dos ideas centrales que responden a como se trabaja realmente en un aula
multigrado:

1. El cuento/situacion es largo y tiene 5 partes (no una sola oracion), para
   poder usarse en Modo interactivo con una pausa real antes del cierre.
2. Toda la clase escucha el MISMO cuento/situacion (mantiene la cohesion del
   aula), pero `generate_grade_tasks` produce una tarea distinta por cada
   grado presente, con complejidad creciente, igual que un docente de aula
   multigrado prepara una sola clase con niveles de exigencia distintos.
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

# ---------------------------------------------------------------------------
# Cuento en 5 partes (Comunicacion)
# ---------------------------------------------------------------------------

STORY_OPENERS = [
    "Esta semana, {personaje} ayudaba en {lugar} cuando algo llamo su atencion relacionado con '{tema}'. El sol todavia estaba bajo y se escuchaban los sonidos de siempre: animales, voces de los vecinos, el viento entre las plantas.",
    "{personaje} siempre prestaba atencion en {lugar}, y hoy queria entender mejor '{tema}'. Llevaba varios dias pensando en eso, desde que lo escucho mencionar en el aula multigrado.",
    "En {lugar}, {personaje} escucho a los mayores hablar sobre '{tema}' y se acerco a preguntar. No queria interrumpir, pero la curiosidad pudo mas que la timidez.",
    "Antes de ir a la escuela, {personaje} paso por {lugar} y encontro algo que tenia que ver con '{tema}'. Se detuvo un momento, dejo su mochila en el suelo y se quedo observando.",
]

STORY_CONTEXT = [
    "Ese dia en particular, {lugar} estaba mas movido de lo normal: habia trabajo por hacer y todos colaboraban segun su edad, desde los mas pequeños hasta los mayores.",
    "Hacia tiempo que {personaje} queria aprender mas sobre esto, pero nunca habia tenido la oportunidad de verlo tan de cerca como ese dia.",
    "Los mayores de la familia solian decir que lo que se aprende observando se queda para toda la vida, y {personaje} lo comprobaria pronto.",
    "No era la primera vez que algo asi pasaba en {lugar}, pero esta vez {personaje} decidio prestar mas atencion que de costumbre.",
]

STORY_COMPLICATIONS = [
    "Sin embargo, surgio una duda: ¿como se relacionaba exactamente '{tema}' con lo que estaba pasando frente a sus ojos? {personaje} no estaba del todo seguro.",
    "El problema fue que, al intentar explicarlo, {personaje} se dio cuenta de que le faltaba entender una parte importante sobre '{tema}'.",
    "De pronto aparecio una dificultad: lo que {personaje} sabia sobre '{tema}' no alcanzaba para resolver lo que tenia enfrente.",
    "Entonces paso algo inesperado que hizo que {personaje} tuviera que pensar con mas cuidado sobre '{tema}' de lo que esperaba.",
]

STORY_MIDDLES = [
    "Al principio no entendia bien como funcionaba, asi que decidio observar con calma y hacer preguntas, una por una, sin apurarse.",
    "Le costo un poco al inicio, pero recordo lo que habian conversado en el aula sobre el tema, y eso le dio una pista para seguir.",
    "Entonces penso en pedir ayuda a alguien con mas experiencia, para no quedarse con la duda y seguir intentando solo.",
    "Decidio probar por su cuenta primero, fijandose en los detalles antes de sacar una conclusion apresurada.",
]

STORY_ENDINGS = [
    "Al final, {personaje} logro entenderlo y se lo explico a otro companero del aula multigrado, que tambien tenia la misma duda.",
    "Gracias a eso, {personaje} pudo terminar la tarea y compartir lo aprendido con su familia esa misma noche, durante la cena.",
    "Cuando lo resolvio, {personaje} se dio cuenta de que lo aprendido en clase si servia en la vida diaria, y eso le dio mas ganas de seguir aprendiendo.",
    "{personaje} termino satisfecho, y al dia siguiente conto la experiencia al resto del salon, que escucho con atencion cada detalle.",
]

PREDICTION_PROMPTS = [
    "Antes de seguir leyendo: ¿que crees que hizo {personaje} despues?",
    "Pausa aqui y pregunta a la clase: ¿como creen que termina esta historia?",
    "Antes de continuar: ¿que harian ustedes en el lugar de {personaje}?",
    "Pregunta para el aula: ¿por que creen que {personaje} se intereso en '{tema}'?",
]

# ---------------------------------------------------------------------------
# Situacion matematica (Matematica)
# ---------------------------------------------------------------------------

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

# Tareas por grado para Comunicacion: mismo cuento, exigencia distinta.
COMUNICACION_GRADE_TASKS = {
    1: (
        "Escucha el cuento y dibuja a {personaje}.",
        "Señala en tu dibujo: ¿donde estaba {personaje}?",
    ),
    2: (
        "Escucha el cuento y marca con una palomita las palabras que reconociste.",
        "¿Que hacia {personaje} al principio del cuento?",
    ),
    3: (
        "Lee el cuento con ayuda y responde con una oracion completa.",
        "¿Cual fue el problema que tuvo {personaje}?",
    ),
    4: (
        "Lee el cuento y ordena los hechos principales en una lista numerada.",
        "¿Como resolvio {personaje} su problema? Describelo en dos oraciones.",
    ),
    5: (
        "Lee el cuento y escribe un resumen breve con tus propias palabras.",
        "¿Que harias distinto si fueras {personaje}? Explica por que.",
    ),
    6: (
        "Lee el cuento, identifica la idea principal y una secundaria.",
        "Relaciona lo que aprendio {personaje} con una situacion de tu propia vida.",
    ),
}

# Tareas por grado para Matematica: extienden el MISMO problema (numeros reales).
def _math_grade_task(grade: int, a: int, b: int, thing: str, respuesta: int) -> tuple[str, str]:
    if grade <= 2:
        smaller = min(a, b)
        return (
            (
                f"Cuenta cuantas {thing} hay en el grupo mas pequeño ({smaller}), agrupando de 10 en "
                "10 con piedritas o chapitas si el numero es grande."
                if smaller > 20
                else f"Cuenta en voz alta hasta {smaller}, usando los dedos o piedritas como apoyo."
            ),
            f"¿Cual grupo tiene mas {thing}: el de {a} o el de {b}?",
        )
    if grade <= 4:
        return (
            "Resuelve la situacion planteada arriba y escribe la operacion completa.",
            f"Comprueba tu respuesta: ¿da {respuesta}?",
        )
    extra = max(3, (a + b) // 6)
    return (
        f"Resuelve la situacion y luego esta ampliacion: si se agregan {extra} {thing} mas, "
        "¿cual seria el nuevo resultado?",
        f"El resultado ampliado deberia ser {respuesta + extra}. ¿Coincide con lo que calculaste?",
    )


def _rng(seed_text: str, variant: int) -> random.Random:
    return random.Random(f"{seed_text}|{variant}")


def generate_story(topic: str, local_context: str | None, variant: int = 0) -> dict[str, object]:
    rng = _rng(topic, variant)
    place = (local_context or "").strip() or rng.choice(DEFAULT_PLACES)
    name, _pronoun = rng.choice(CHARACTERS)

    parte1 = STORY_OPENERS[(len(topic) + variant) % len(STORY_OPENERS)].format(
        personaje=name, lugar=place, tema=topic
    )
    parte2 = STORY_CONTEXT[(len(topic) + variant * 3) % len(STORY_CONTEXT)].format(
        personaje=name, lugar=place
    )
    parte3 = STORY_COMPLICATIONS[(len(place) + variant * 2) % len(STORY_COMPLICATIONS)].format(
        personaje=name, tema=topic
    )
    parte4 = STORY_MIDDLES[(len(place) + variant) % len(STORY_MIDDLES)]
    parte5 = STORY_ENDINGS[(len(name) + variant) % len(STORY_ENDINGS)].format(personaje=name)

    partes = [parte1, parte2, parte3, parte4, parte5]
    texto = "\n\n".join(partes)
    pregunta = PREDICTION_PROMPTS[(len(topic) + len(name) + variant) % len(PREDICTION_PROMPTS)].format(
        personaje=name, tema=topic
    )
    return {
        "texto": texto,
        "partes": partes,
        "pregunta_interactiva": pregunta,
        "personaje": name,
        "lugar": place,
    }


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
) -> dict[str, object]:
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
        a, b = total, groups
        texto = (
            f"En {place}, {name} repartio {total} {thing} en partes iguales entre {groups} {unit}. "
            f"¿{cuantos} {thing} hay en cada {unit_singular}?"
        )

    pregunta = MATH_PREDICTION_PROMPTS[(len(topic) + variant) % len(MATH_PREDICTION_PROMPTS)]
    return {
        "texto": texto,
        "partes": [texto],
        "pregunta_interactiva": pregunta,
        "respuesta_clave": str(respuesta),
        "operacion": operation,
        "numbers": {"a": a, "b": b, "thing": thing, "respuesta": respuesta},
    }


def generate_grade_tasks(
    area: str,
    topic: str,
    grades: list[int],
    story: dict[str, object] | None = None,
    math: dict[str, object] | None = None,
) -> list[dict[str, str]]:
    """Misma situacion, exigencia distinta por grado (diferenciacion real de
    contenido en aula multigrado, no solo por nivel de apoyo)."""
    is_comunicacion = area.lower().startswith("com")
    tasks: list[dict[str, str]] = []
    for grade in sorted(set(grades)):
        if is_comunicacion:
            personaje = (story or {}).get("personaje", "el personaje")
            bucket = min(max(grade, 1), 6)
            instruccion, pregunta = COMUNICACION_GRADE_TASKS[bucket]
            tasks.append(
                {
                    "grado": grade,
                    "instruccion": instruccion.format(personaje=personaje),
                    "pregunta": pregunta.format(personaje=personaje),
                }
            )
        else:
            numbers = (math or {}).get("numbers") or {"a": 10, "b": 5, "respuesta": 15, "thing": "elementos"}
            instruccion, pregunta = _math_grade_task(
                grade, numbers["a"], numbers["b"], numbers["thing"], numbers["respuesta"]
            )
            tasks.append({"grado": grade, "instruccion": instruccion, "pregunta": pregunta})
    return tasks
