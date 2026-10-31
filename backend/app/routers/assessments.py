from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.database import get_session
from app.models import Assessment, Competency, Student
from app.rules import classify_score, explain_rule
from app.schemas import AssessmentCreate, AssessmentOut

router = APIRouter(prefix="/api/assessments", tags=["assessments"])


@router.get("", response_model=list[AssessmentOut])
def list_assessments(session: Session = Depends(get_session)):
    assessments = session.exec(
        select(Assessment).order_by(Assessment.assessment_date.desc())
    ).all()
    results = []
    for a in assessments:
        student = session.get(Student, a.student_id)
        comp = session.get(Competency, a.competency_id)
        level, pct = classify_score(a.score, a.max_score)
        results.append(
            AssessmentOut(
                id=a.id,
                student_id=a.student_id,
                student_code=student.student_code if student else "",
                competency_id=a.competency_id,
                competency_name=comp.name if comp else "",
                area=comp.area if comp else "",
                assessment_date=a.assessment_date,
                score=a.score,
                max_score=a.max_score,
                score_pct=pct,
                support_level=level,
                notes=a.notes,
                source=a.source,
            )
        )
    return results


@router.post("", response_model=AssessmentOut, status_code=201)
def create_assessment(payload: AssessmentCreate, session: Session = Depends(get_session)):
    student = session.get(Student, payload.student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado.")
    comp = session.get(Competency, payload.competency_id)
    if not comp:
        raise HTTPException(status_code=404, detail="Competencia no encontrada.")

    data = payload.model_dump()
    if data.get("assessment_date") is None:
        data.pop("assessment_date")
    assessment = Assessment(**data)
    session.add(assessment)
    session.commit()
    session.refresh(assessment)

    level, pct = classify_score(assessment.score, assessment.max_score)
    return AssessmentOut(
        id=assessment.id,
        student_id=assessment.student_id,
        student_code=student.student_code,
        competency_id=assessment.competency_id,
        competency_name=comp.name,
        area=comp.area,
        assessment_date=assessment.assessment_date,
        score=assessment.score,
        max_score=assessment.max_score,
        score_pct=pct,
        support_level=level,
        notes=assessment.notes,
        source=assessment.source,
    )


@router.get("/rule")
def get_rule_explanation():
    return {"explanation": explain_rule()}
