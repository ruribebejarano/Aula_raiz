from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.database import get_session
from app.models import Assessment, Competency, Student
from app.rules import classify_score
from app.schemas import StudentCreate, StudentOut, StudentUpdate

router = APIRouter(prefix="/api/students", tags=["students"])


def _to_out(session: Session, student: Student) -> StudentOut:
    last_assessment = session.exec(
        select(Assessment)
        .where(Assessment.student_id == student.id)
        .order_by(Assessment.assessment_date.desc(), Assessment.id.desc())
    ).first()
    last_competency = None
    last_score_pct = None
    last_support_level = None
    if last_assessment:
        comp = session.get(Competency, last_assessment.competency_id)
        last_competency = comp.name if comp else None
        last_support_level, last_score_pct = classify_score(
            last_assessment.score, last_assessment.max_score
        )
    return StudentOut(
        id=student.id,
        student_code=student.student_code,
        grade=student.grade,
        classroom_group=student.classroom_group,
        active=student.active,
        created_at=student.created_at,
        last_competency=last_competency,
        last_score_pct=last_score_pct,
        last_support_level=last_support_level,
    )


@router.get("", response_model=list[StudentOut])
def list_students(session: Session = Depends(get_session)):
    students = session.exec(select(Student).order_by(Student.student_code)).all()
    return [_to_out(session, s) for s in students]


@router.post("", response_model=StudentOut, status_code=201)
def create_student(payload: StudentCreate, session: Session = Depends(get_session)):
    existing = session.exec(
        select(Student).where(Student.student_code == payload.student_code)
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="Ya existe un estudiante con ese codigo.")
    student = Student(**payload.model_dump())
    session.add(student)
    session.commit()
    session.refresh(student)
    return _to_out(session, student)


@router.get("/{student_id}", response_model=StudentOut)
def get_student(student_id: int, session: Session = Depends(get_session)):
    student = session.get(Student, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado.")
    return _to_out(session, student)


@router.put("/{student_id}", response_model=StudentOut)
def update_student(
    student_id: int, payload: StudentUpdate, session: Session = Depends(get_session)
):
    student = session.get(Student, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado.")
    data = payload.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(student, key, value)
    session.add(student)
    session.commit()
    session.refresh(student)
    return _to_out(session, student)


@router.get("/{student_id}/assessments")
def get_student_assessments(student_id: int, session: Session = Depends(get_session)):
    student = session.get(Student, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado.")
    assessments = session.exec(
        select(Assessment)
        .where(Assessment.student_id == student_id)
        .order_by(Assessment.assessment_date.desc())
    ).all()
    results = []
    for a in assessments:
        comp = session.get(Competency, a.competency_id)
        level, pct = classify_score(a.score, a.max_score)
        results.append(
            {
                "id": a.id,
                "competency_id": a.competency_id,
                "competency_name": comp.name if comp else "",
                "area": comp.area if comp else "",
                "assessment_date": a.assessment_date,
                "score": a.score,
                "max_score": a.max_score,
                "score_pct": pct,
                "support_level": level,
                "notes": a.notes,
                "source": a.source,
            }
        )
    return results
