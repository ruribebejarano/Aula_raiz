from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.database import get_session
from app.models import Competency, LearningGroup, LearningGroupMember, Student
from app.schemas import GroupMoveRequest, GroupOut, GroupMemberOut
from app.seed import recalculate_groups

router = APIRouter(prefix="/api/groups", tags=["groups"])


def _build_groups_out(session: Session) -> list[GroupOut]:
    groups = session.exec(select(LearningGroup)).all()
    out = []
    for g in groups:
        comp = session.get(Competency, g.competency_id)
        members = session.exec(
            select(LearningGroupMember).where(LearningGroupMember.group_id == g.id)
        ).all()
        member_out = []
        for m in members:
            student = session.get(Student, m.student_id)
            if not student:
                continue
            member_out.append(
                GroupMemberOut(
                    student_id=student.id,
                    student_code=student.student_code,
                    grade=student.grade,
                    assigned_by=m.assigned_by,
                )
            )
        out.append(
            GroupOut(
                id=g.id,
                name=g.name,
                competency_id=g.competency_id,
                competency_name=comp.name if comp else "",
                area=comp.area if comp else "",
                support_level=g.support_level,
                description=g.description,
                members=member_out,
            )
        )
    return out


@router.get("", response_model=list[GroupOut])
def list_groups(session: Session = Depends(get_session)):
    return _build_groups_out(session)


@router.post("/recalculate", response_model=list[GroupOut])
def recalculate(session: Session = Depends(get_session)):
    recalculate_groups(session)
    return _build_groups_out(session)


@router.post("/move", response_model=list[GroupOut])
def move_student(payload: GroupMoveRequest, session: Session = Depends(get_session)):
    target = session.get(LearningGroup, payload.target_group_id)
    if not target:
        raise HTTPException(status_code=404, detail="Grupo destino no encontrado.")
    student = session.get(Student, payload.student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado.")

    siblings = session.exec(
        select(LearningGroup).where(LearningGroup.competency_id == target.competency_id)
    ).all()
    sibling_ids = [g.id for g in siblings]
    existing_memberships = session.exec(
        select(LearningGroupMember).where(
            LearningGroupMember.student_id == payload.student_id,
            LearningGroupMember.group_id.in_(sibling_ids),
        )
    ).all()
    for m in existing_memberships:
        session.delete(m)
    session.commit()

    session.add(
        LearningGroupMember(
            group_id=target.id, student_id=payload.student_id, assigned_by="teacher"
        )
    )
    session.commit()
    return _build_groups_out(session)
