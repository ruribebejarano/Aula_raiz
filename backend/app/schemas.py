from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, Field


# ---------- Students ----------
class StudentCreate(BaseModel):
    student_code: str = Field(min_length=2, max_length=20)
    grade: int = Field(ge=1, le=6)
    classroom_group: Optional[str] = None
    active: bool = True


class StudentUpdate(BaseModel):
    grade: Optional[int] = Field(default=None, ge=1, le=6)
    classroom_group: Optional[str] = None
    active: Optional[bool] = None


class StudentOut(BaseModel):
    id: int
    student_code: str
    grade: int
    classroom_group: Optional[str]
    active: bool
    created_at: datetime
    last_competency: Optional[str] = None
    last_score_pct: Optional[float] = None
    last_support_level: Optional[str] = None


# ---------- Assessments ----------
class AssessmentCreate(BaseModel):
    student_id: int
    competency_id: int
    assessment_date: Optional[date] = None
    score: float = Field(ge=0)
    max_score: float = Field(default=100, gt=0)
    notes: Optional[str] = None
    source: str = "manual"


class AssessmentOut(BaseModel):
    id: int
    student_id: int
    student_code: str
    competency_id: int
    competency_name: str
    area: str
    assessment_date: date
    score: float
    max_score: float
    score_pct: float
    support_level: str
    notes: Optional[str]
    source: str


# ---------- Groups ----------
class GroupMemberOut(BaseModel):
    student_id: int
    student_code: str
    grade: int
    assigned_by: str


class GroupOut(BaseModel):
    id: int
    name: str
    competency_id: int
    competency_name: str
    area: str
    support_level: str
    description: Optional[str]
    members: list[GroupMemberOut]


class GroupMoveRequest(BaseModel):
    student_id: int
    target_group_id: int


# ---------- Materials / Biblioteca IA ----------
class MaterialGenerateRequest(BaseModel):
    area: str
    topic: str
    grades: list[int]
    support_levels: list[str] = Field(default_factory=list)
    duration_minutes: int = 45
    available_resources: Optional[str] = None
    local_context: Optional[str] = None
    format: str = "ficha"  # "ficha" | "sesion"


class MaterialOut(BaseModel):
    id: int
    title: str
    area: str
    topic: str
    grade_range: str
    format: str
    provider: str
    created_at: datetime
    content: dict


# ---------- Lesson plans ----------
class LessonGenerateRequest(BaseModel):
    area: str
    topic: str
    grades: list[int]
    support_levels: list[str] = Field(default_factory=list)
    duration_minutes: int = 45
    available_resources: Optional[str] = None
    local_context: Optional[str] = None


class LessonOut(BaseModel):
    id: int
    title: str
    topic: str
    duration_minutes: int
    created_at: datetime
    content: dict


# ---------- Dashboard / Radar / Settings ----------
class DashboardOut(BaseModel):
    school_name: str
    total_students: int
    active_students: int
    assessments_count: int
    pending_review: int
    groups_count: int
    materials_count: int
    is_demo_data: bool = True


class RadarCompetencySummary(BaseModel):
    competency_id: int
    competency_name: str
    area: str
    average_pct: float
    assessments_count: int
    needs_reinforcement: bool


class RadarSupportDistribution(BaseModel):
    support_level: str
    count: int


class RadarSummaryOut(BaseModel):
    by_competency: list[RadarCompetencySummary]
    support_distribution: list[RadarSupportDistribution]
    students_pending_review: list[str]
    recommended_next_action: str


class AISettingsOut(BaseModel):
    provider_configured: str
    provider_active: str
    ollama_reachable: Optional[bool] = None
    message: str


class HealthOut(BaseModel):
    status: str
    server_local: bool = True
    internet_external: str = "no_verificado"
    ai_mode: str
