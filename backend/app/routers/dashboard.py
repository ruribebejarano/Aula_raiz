from fastapi import APIRouter, Depends
from sqlmodel import Session, func, select

from app.config import settings
from app.database import get_session
from app.models import Assessment, GeneratedMaterial, LearningGroup, Student
from app.schemas import DashboardOut

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("", response_model=DashboardOut)
def get_dashboard(session: Session = Depends(get_session)):
    total_students = session.exec(select(func.count(Student.id))).one()
    active_students = session.exec(
        select(func.count(Student.id)).where(Student.active == True)  # noqa: E712
    ).one()
    assessments_count = session.exec(select(func.count(Assessment.id))).one()
    groups_count = session.exec(select(func.count(LearningGroup.id))).one()
    materials_count = session.exec(select(func.count(GeneratedMaterial.id))).one()

    students_with_assessment = session.exec(
        select(func.count(func.distinct(Assessment.student_id)))
    ).one()
    pending_review = max(0, active_students - students_with_assessment)

    return DashboardOut(
        school_name=settings.school_name,
        total_students=total_students,
        active_students=active_students,
        assessments_count=assessments_count,
        pending_review=pending_review,
        groups_count=groups_count,
        materials_count=materials_count,
        is_demo_data=True,
    )
