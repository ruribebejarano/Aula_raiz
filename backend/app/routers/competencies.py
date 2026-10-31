from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.database import get_session
from app.models import Competency

router = APIRouter(prefix="/api/competencies", tags=["competencies"])


@router.get("")
def list_competencies(session: Session = Depends(get_session)):
    comps = session.exec(select(Competency).order_by(Competency.area, Competency.name)).all()
    return [
        {"id": c.id, "area": c.area, "name": c.name, "description": c.description}
        for c in comps
    ]
