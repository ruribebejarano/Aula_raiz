import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlmodel import Session

from app.ai_provider import get_ai_provider
from app.config import settings
from app.database import engine, init_db
from app.routers import (
    assessments,
    competencies,
    dashboard,
    groups,
    lessons,
    materials,
    radar,
    settings_router,
    students,
)
from app.schemas import HealthOut
from app.seed import seed_if_empty

app = FastAPI(title="AULA RAIZ API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    init_db()
    with Session(engine) as session:
        seed_if_empty(session)


@app.get("/api/health", response_model=HealthOut)
def health():
    provider = get_ai_provider()
    status = provider.status()
    return HealthOut(status="ok", server_local=True, ai_mode=status.get("provider_active", "demo"))


app.include_router(students.router)
app.include_router(competencies.router)
app.include_router(assessments.router)
app.include_router(groups.router)
app.include_router(materials.router)
app.include_router(lessons.router)
app.include_router(radar.router)
app.include_router(dashboard.router)
app.include_router(settings_router.router)

# Si existe un build de frontend (frontend/dist), se sirve desde el mismo
# puerto que la API. Esto evita problemas de CORS/URL al acceder desde el
# celular del docente: basta abrir http://<IP-LAN-de-AULA-BOX>:8000
_frontend_dist = os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist")
if os.path.isdir(_frontend_dist):
    app.mount("/", StaticFiles(directory=_frontend_dist, html=True), name="frontend")
