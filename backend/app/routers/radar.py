from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.database import get_session
from app.models import Assessment, Competency, Student
from app.rules import classify_score
from app.schemas import RadarCompetencySummary, RadarSummaryOut, RadarSupportDistribution

router = APIRouter(prefix="/api/radar", tags=["radar"])


@router.get("/summary", response_model=RadarSummaryOut)
def get_radar_summary(session: Session = Depends(get_session)):
    competencies = session.exec(select(Competency)).all()
    by_competency: list[RadarCompetencySummary] = []
    support_counts: dict[str, int] = {}

    all_assessments = session.exec(select(Assessment)).all()
    latest_by_student_and_comp: dict[tuple[int, int], Assessment] = {}
    for a in all_assessments:
        key = (a.student_id, a.competency_id)
        prev = latest_by_student_and_comp.get(key)
        if prev is None or a.assessment_date >= prev.assessment_date:
            latest_by_student_and_comp[key] = a

    for comp in competencies:
        comp_assessments = [
            a for (sid, cid), a in latest_by_student_and_comp.items() if cid == comp.id
        ]
        if not comp_assessments:
            continue
        pcts = []
        for a in comp_assessments:
            level, pct = classify_score(a.score, a.max_score)
            pcts.append(pct)
            support_counts[level] = support_counts.get(level, 0) + 1
        avg = round(sum(pcts) / len(pcts), 1)
        by_competency.append(
            RadarCompetencySummary(
                competency_id=comp.id,
                competency_name=comp.name,
                area=comp.area,
                average_pct=avg,
                assessments_count=len(comp_assessments),
                needs_reinforcement=avg < 70,
            )
        )

    all_students = session.exec(select(Student).where(Student.active == True)).all()  # noqa: E712
    assessed_student_ids = {sid for (sid, _cid) in latest_by_student_and_comp.keys()}
    pending = [s.student_code for s in all_students if s.id not in assessed_student_ids]

    weakest = sorted(by_competency, key=lambda c: c.average_pct)
    if weakest and weakest[0].needs_reinforcement:
        recommendation = (
            f"Conviene reforzar '{weakest[0].competency_name}' ({weakest[0].area}): "
            f"promedio {weakest[0].average_pct}% en los ultimos registros."
        )
    elif pending:
        recommendation = "Hay estudiantes sin diagnostico reciente; conviene aplicar una evaluacion breve."
    else:
        recommendation = "Los resultados recientes estan dentro del desempeno esperado para las actividades aplicadas."

    return RadarSummaryOut(
        by_competency=sorted(by_competency, key=lambda c: c.average_pct),
        support_distribution=[
            RadarSupportDistribution(support_level=level, count=count)
            for level, count in support_counts.items()
        ],
        students_pending_review=pending,
        recommended_next_action=recommendation,
    )
