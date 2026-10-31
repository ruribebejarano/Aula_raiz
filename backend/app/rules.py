"""Reglas de clasificacion de NIVELA AI.

Estos umbrales son parametros ilustrativos del prototipo, no niveles
oficiales del Minedu. Son transparentes, editables y sirven unicamente
para organizar el trabajo docente dentro del MVP.
"""

PRIORITY = "Requiere acompanamiento prioritario"
DEVELOPING = "En desarrollo"
EXPECTED = "Desempeno esperado para esta actividad"

THRESHOLDS = {
    "priority_max": 39,
    "developing_max": 69,
}


def classify_score(score: float, max_score: float) -> tuple[str, float]:
    """Devuelve (nivel_apoyo, porcentaje) a partir de un puntaje crudo."""
    if max_score <= 0:
        raise ValueError("max_score debe ser mayor que cero")
    pct = round((score / max_score) * 100, 1)
    if pct <= THRESHOLDS["priority_max"]:
        level = PRIORITY
    elif pct <= THRESHOLDS["developing_max"]:
        level = DEVELOPING
    else:
        level = EXPECTED
    return level, pct


def explain_rule() -> str:
    return (
        f"0%-{THRESHOLDS['priority_max']}%: {PRIORITY}. "
        f"{THRESHOLDS['priority_max']+1}%-{THRESHOLDS['developing_max']}%: {DEVELOPING}. "
        f"{THRESHOLDS['developing_max']+1}%-100%: {EXPECTED}. "
        "Umbrales ilustrativos y configurables, no equivalen a niveles oficiales del Minedu."
    )
