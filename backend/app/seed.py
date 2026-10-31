import json
import random
from datetime import date, timedelta

from sqlmodel import Session, select

from app.models import (
    Assessment,
    Competency,
    GeneratedMaterial,
    LearningGroup,
    LearningGroupMember,
    LessonPlan,
    Student,
)
from app.rules import classify_score

CNEB = "Curriculo Nacional de la Educacion Basica (CNEB), Minedu 2016"

# Nombres de competencia tomados tal cual del CNEB (Minedu), no inventados.
# Fuente: https://www.minedu.gob.pe/curriculo/pdf/curriculo-nacional-2016.pdf
COMPETENCIES = [
    ("Matematica", "Resuelve problemas de cantidad", "Usa numeros y operaciones para representar y resolver situaciones.", CNEB),
    ("Matematica", "Resuelve problemas de regularidad, equivalencia y cambio", "Identifica patrones, equivalencias y relaciones de cambio.", CNEB),
    ("Matematica", "Resuelve problemas de forma, movimiento y localizacion", "Reconoce, compara y describe formas y ubicaciones.", CNEB),
    ("Comunicacion", "Lee diversos tipos de textos escritos en su lengua materna", "Comprende textos adecuados a su grado, identificando ideas explicitas e implicitas.", CNEB),
    ("Comunicacion", "Escribe diversos tipos de textos en su lengua materna", "Produce textos breves con coherencia y proposito claro.", CNEB),
    ("Comunicacion", "Se comunica oralmente en su lengua materna", "Expresa y comprende ideas de forma oral, adaptandose a la situacion comunicativa.", CNEB),
]

STUDENTS = [
    (1, "A"), (1, "A"),
    (2, "A"), (2, "A"),
    (3, "B"), (3, "B"),
    (4, "B"), (4, "B"),
    (5, "C"), (5, "C"),
    (6, "C"), (6, "C"),
]


def seed_if_empty(session: Session) -> None:
    existing = session.exec(select(Student)).first()
    if existing:
        return

    competencies: list[Competency] = []
    for area, name, description, source in COMPETENCIES:
        comp = Competency(area=area, name=name, description=description, curricular_source=source)
        session.add(comp)
        competencies.append(comp)
    session.commit()

    students: list[Student] = []
    for idx, (grade, group) in enumerate(STUDENTS, start=1):
        student = Student(
            student_code=f"E-{idx:03d}",
            grade=grade,
            classroom_group=group,
            active=True,
        )
        session.add(student)
        students.append(student)
    session.commit()

    rng = random.Random(42)
    today = date.today()
    for student in students:
        relevant = [c for c in competencies if _competency_fits_grade(c, student.grade)]
        for comp in rng.sample(relevant, k=min(2, len(relevant))):
            score = rng.choice([30, 35, 45, 55, 65, 75, 80, 90])
            session.add(
                Assessment(
                    student_id=student.id,
                    competency_id=comp.id,
                    assessment_date=today - timedelta(days=rng.randint(0, 20)),
                    score=score,
                    max_score=100,
                    notes="Resultado de demostracion precargado.",
                    source="quiz_demo",
                )
            )
    session.commit()

    _recalculate_groups(session)

    sample_material = {
        "titulo": "Ficha diferenciada: La vida en la chacra (demo)",
        "area": "Comunicacion",
        "tema": "La vida en la chacra",
        "grado_grupo": "1er grado - 2do grado",
        "proposito": "Comprender un texto breve sobre actividades agricolas de la comunidad.",
        "texto_o_situacion": (
            "En la chacra de la familia Quispe, todos ayudan segun su edad: los mas pequeños "
            "recogen las hojas sueltas, mientras los mayores preparan la tierra para la siguiente "
            "siembra.\n\nCuando termina el dia, se reunen a conversar sobre lo que sembraron, y "
            "deciden anotar en un cuaderno lo que aprendieron para no olvidarlo."
        ),
        "pregunta_interactiva": "Antes de seguir leyendo: ¿que creen que anotaron en el cuaderno?",
        "respuesta_clave": None,
        "materiales": ["Ficha impresa", "Lapiz"],
        "instrucciones": ["Lee el texto en voz alta.", "Responde las preguntas segun tu nivel."],
        "actividades_por_grupo": [
            {"grupo": "En desarrollo", "actividad": "Responder 2 preguntas literales."},
        ],
        "preguntas": [
            {"enunciado": "¿Que se siembra en la chacra del texto?", "pauta_de_revision": "Revisar comprension literal."}
        ],
        "adaptacion": {"reforzar": "Leer en pareja con el docente.", "ampliar": "Escribir una oracion nueva."},
        "indicacion_impresion": "A4, blanco y negro.",
        "contexto_local": "Chacra familiar de la comunidad.",
        "aviso": "Contenido de demostracion. Revisar antes de aplicar.",
    }
    session.add(
        GeneratedMaterial(
            title=sample_material["titulo"],
            area="Comunicacion",
            topic="La vida en la chacra",
            grade_range="1er grado - 2do grado",
            format="ficha",
            content_json=json.dumps(sample_material, ensure_ascii=False),
            provider="demo",
        )
    )
    session.commit()


def _competency_fits_grade(comp: Competency, grade: int) -> bool:
    if comp.area == "Matematica":
        return True
    return True


def recalculate_groups(session: Session) -> None:
    _recalculate_groups(session)


def _recalculate_groups(session: Session) -> None:
    session.exec(select(LearningGroupMember)).all()
    for member in session.exec(select(LearningGroupMember)).all():
        session.delete(member)
    for group in session.exec(select(LearningGroup)).all():
        session.delete(group)
    session.commit()

    competencies = session.exec(select(Competency)).all()
    for comp in competencies:
        assessments = session.exec(
            select(Assessment).where(Assessment.competency_id == comp.id)
        ).all()
        latest_by_student: dict[int, Assessment] = {}
        for a in assessments:
            prev = latest_by_student.get(a.student_id)
            if prev is None or a.assessment_date >= prev.assessment_date:
                latest_by_student[a.student_id] = a

        by_level: dict[str, list[int]] = {}
        for student_id, assessment in latest_by_student.items():
            level, _ = classify_score(assessment.score, assessment.max_score)
            by_level.setdefault(level, []).append(student_id)

        for level, student_ids in by_level.items():
            group = LearningGroup(
                name=f"{comp.name} - {level}",
                competency_id=comp.id,
                support_level=level,
                description=f"Agrupacion sugerida por regla segun ultimo resultado registrado en {comp.name}.",
            )
            session.add(group)
            session.commit()
            for sid in student_ids:
                session.add(
                    LearningGroupMember(group_id=group.id, student_id=sid, assigned_by="rule")
                )
            session.commit()
