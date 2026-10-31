import json

from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.ai_provider import get_ai_provider
from app.database import get_session
from app.models import LessonPlan
from app.schemas import LessonGenerateRequest, LessonOut

router = APIRouter(prefix="/api/lessons", tags=["lessons"])


@router.get("", response_model=list[LessonOut])
def list_lessons(session: Session = Depends(get_session)):
    lessons = session.exec(select(LessonPlan).order_by(LessonPlan.created_at.desc())).all()
    return [
        LessonOut(
            id=l.id,
            title=l.title,
            topic=l.topic,
            duration_minutes=l.duration_minutes,
            provider=l.provider,
            created_at=l.created_at,
            content=json.loads(l.content_json),
        )
        for l in lessons
    ]


@router.post("/generate", response_model=LessonOut, status_code=201)
def generate_lesson(payload: LessonGenerateRequest, session: Session = Depends(get_session)):
    provider = get_ai_provider()
    req = payload.model_dump()
    result = provider.generate_lesson(req)

    lesson = LessonPlan(
        title=result.content.get("titulo", payload.topic),
        topic=payload.topic,
        duration_minutes=payload.duration_minutes,
        content_json=json.dumps(result.content, ensure_ascii=False),
        provider=result.provider_used,
    )
    session.add(lesson)
    session.commit()
    session.refresh(lesson)

    return LessonOut(
        id=lesson.id,
        title=lesson.title,
        topic=lesson.topic,
        duration_minutes=lesson.duration_minutes,
        provider=lesson.provider,
        created_at=lesson.created_at,
        content=result.content,
    )
