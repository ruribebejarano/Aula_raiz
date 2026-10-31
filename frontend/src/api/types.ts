export interface Student {
  id: number;
  student_code: string;
  grade: number;
  classroom_group: string | null;
  active: boolean;
  created_at: string;
  last_competency: string | null;
  last_score_pct: number | null;
  last_support_level: string | null;
}

export interface Competency {
  id: number;
  area: string;
  name: string;
  description: string | null;
}

export interface Assessment {
  id: number;
  student_id: number;
  student_code: string;
  competency_id: number;
  competency_name: string;
  area: string;
  assessment_date: string;
  score: number;
  max_score: number;
  score_pct: number;
  support_level: string;
  notes: string | null;
  source: string;
}

export interface GroupMember {
  student_id: number;
  student_code: string;
  grade: number;
  assigned_by: string;
}

export interface LearningGroup {
  id: number;
  name: string;
  competency_id: number;
  competency_name: string;
  area: string;
  support_level: string;
  description: string | null;
  members: GroupMember[];
}

export interface MaterialContent {
  titulo: string;
  area: string;
  tema: string;
  grado_grupo: string;
  proposito: string;
  materiales: string[];
  instrucciones: string[];
  actividades_por_grupo: { grupo: string; actividad: string }[];
  preguntas: { enunciado: string; pauta_de_revision: string }[];
  adaptacion: { reforzar: string; ampliar: string };
  indicacion_impresion: string;
  contexto_local: string;
  aviso: string;
}

export interface Material {
  id: number;
  title: string;
  area: string;
  topic: string;
  grade_range: string;
  format: string;
  provider: string;
  created_at: string;
  content: MaterialContent;
}

export interface LessonContent {
  titulo: string;
  area: string;
  tema: string;
  grado_grupo: string;
  duracion_minutos: number;
  proposito: string;
  materiales: string[];
  momentos: { momento: string; duracion_minutos: number; descripcion: string }[];
  actividades_por_grupo: { grupo: string; actividad: string }[];
  sugerencia_evaluacion: string;
  contexto_local: string;
  aviso: string;
}

export interface LessonPlan {
  id: number;
  title: string;
  topic: string;
  duration_minutes: number;
  created_at: string;
  content: LessonContent;
}

export interface DashboardSummary {
  school_name: string;
  total_students: number;
  active_students: number;
  assessments_count: number;
  pending_review: number;
  groups_count: number;
  materials_count: number;
  is_demo_data: boolean;
}

export interface RadarCompetencySummary {
  competency_id: number;
  competency_name: string;
  area: string;
  average_pct: number;
  assessments_count: number;
  needs_reinforcement: boolean;
}

export interface RadarSupportDistribution {
  support_level: string;
  count: number;
}

export interface RadarSummary {
  by_competency: RadarCompetencySummary[];
  support_distribution: RadarSupportDistribution[];
  students_pending_review: string[];
  recommended_next_action: string;
}

export interface AISettings {
  provider_configured: string;
  provider_active: string;
  ollama_reachable?: boolean | null;
  message: string;
}

export interface Health {
  status: string;
  server_local: boolean;
  internet_external: string;
  ai_mode: string;
}
