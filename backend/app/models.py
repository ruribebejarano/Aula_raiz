from datetime import datetime, date
from typing import Optional

from sqlmodel import SQLModel, Field


class Student(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    student_code: str = Field(index=True, unique=True)
    grade: int
    classroom_group: Optional[str] = None
    active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Competency(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    area: str  # "Comunicacion" | "Matematica"
    name: str
    description: Optional[str] = None


class Assessment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    student_id: int = Field(foreign_key="student.id")
    competency_id: int = Field(foreign_key="competency.id")
    assessment_date: date = Field(default_factory=date.today)
    score: float
    max_score: float = 100
    notes: Optional[str] = None
    source: str = "manual"  # "manual" | "quiz_demo"


class LearningGroup(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    competency_id: int = Field(foreign_key="competency.id")
    support_level: str
    description: Optional[str] = None


class LearningGroupMember(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    group_id: int = Field(foreign_key="learninggroup.id")
    student_id: int = Field(foreign_key="student.id")
    assigned_by: str = "rule"  # "rule" | "teacher"


class GeneratedMaterial(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    area: str
    topic: str
    grade_range: str
    format: str = "ficha"  # "ficha" | "sesion"
    content_json: str  # JSON serializado como texto (compatibilidad SQLite)
    provider: str = "demo"  # "demo" | "ollama"
    created_at: datetime = Field(default_factory=datetime.utcnow)


class LessonPlan(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    topic: str
    duration_minutes: int
    content_json: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
