import json

from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.ai_provider import get_ai_provider, grade_range_label
from app.database import get_session
from app.models import GeneratedMaterial
from app.schemas import MaterialGenerateRequest, MaterialOut

router = APIRouter(prefix="/api/materials", tags=["materials"])


@router.get("", response_model=list[MaterialOut])
def list_materials(session: Session = Depends(get_session)):
    materials = session.exec(
        select(GeneratedMaterial).order_by(GeneratedMaterial.created_at.desc())
    ).all()
    return [
        MaterialOut(
            id=m.id,
            title=m.title,
            area=m.area,
            topic=m.topic,
            grade_range=m.grade_range,
            format=m.format,
            provider=m.provider,
            created_at=m.created_at,
            content=json.loads(m.content_json),
        )
        for m in materials
    ]


@router.post("/generate", response_model=MaterialOut, status_code=201)
def generate_material(payload: MaterialGenerateRequest, session: Session = Depends(get_session)):
    provider = get_ai_provider()
    req = payload.model_dump()
    result = provider.generate_material(req)

    material = GeneratedMaterial(
        title=result.content.get("titulo", payload.topic),
        area=payload.area,
        topic=payload.topic,
        grade_range=grade_range_label(payload.grades),
        format=payload.format,
        content_json=json.dumps(result.content, ensure_ascii=False),
        provider=result.provider_used,
    )
    session.add(material)
    session.commit()
    session.refresh(material)

    return MaterialOut(
        id=material.id,
        title=material.title,
        area=material.area,
        topic=material.topic,
        grade_range=material.grade_range,
        format=material.format,
        provider=material.provider,
        created_at=material.created_at,
        content=result.content,
    )


@router.get("/{material_id}", response_model=MaterialOut)
def get_material(material_id: int, session: Session = Depends(get_session)):
    material = session.get(GeneratedMaterial, material_id)
    if not material:
        from fastapi import HTTPException

        raise HTTPException(status_code=404, detail="Material no encontrado.")
    return MaterialOut(
        id=material.id,
        title=material.title,
        area=material.area,
        topic=material.topic,
        grade_range=material.grade_range,
        format=material.format,
        provider=material.provider,
        created_at=material.created_at,
        content=json.loads(material.content_json),
    )
