from fastapi import APIRouter

from app.ai_provider import get_ai_provider
from app.config import settings

router = APIRouter(prefix="/api/settings", tags=["settings"])


@router.get("/ai")
def ai_settings():
    provider = get_ai_provider()
    status = provider.status()
    return {
        "provider_configured": settings.ai_provider,
        **status,
    }
