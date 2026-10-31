import { api } from "./client";
import type {
  AISettings,
  Assessment,
  Competency,
  DashboardSummary,
  Health,
  LearningGroup,
  LessonPlan,
  Material,
  RadarSummary,
  Student,
} from "./types";

export const getHealth = () => api.get<Health>("/api/health");
export const getDashboard = () => api.get<DashboardSummary>("/api/dashboard");
export const getAISettings = () => api.get<AISettings>("/api/settings/ai");

export const listStudents = () => api.get<Student[]>("/api/students");
export const getStudent = (id: number) => api.get<Student>(`/api/students/${id}`);
export const createStudent = (payload: {
  student_code: string;
  grade: number;
  classroom_group?: string | null;
}) => api.post<Student>("/api/students", payload);
export const updateStudent = (
  id: number,
  payload: Partial<{ grade: number; classroom_group: string | null; active: boolean }>
) => api.put<Student>(`/api/students/${id}`, payload);
export const getStudentAssessments = (id: number) =>
  api.get<Assessment[]>(`/api/students/${id}/assessments`);

export const listCompetencies = () => api.get<Competency[]>("/api/competencies");

export const listAssessments = () => api.get<Assessment[]>("/api/assessments");
export const createAssessment = (payload: {
  student_id: number;
  competency_id: number;
  score: number;
  max_score?: number;
  notes?: string;
  source?: string;
}) => api.post<Assessment>("/api/assessments", payload);
export const getRuleExplanation = () => api.get<{ explanation: string }>("/api/assessments/rule");

export const listGroups = () => api.get<LearningGroup[]>("/api/groups");
export const recalculateGroups = () => api.post<LearningGroup[]>("/api/groups/recalculate");
export const moveStudentToGroup = (student_id: number, target_group_id: number) =>
  api.post<LearningGroup[]>("/api/groups/move", { student_id, target_group_id });

export const listMaterials = () => api.get<Material[]>("/api/materials");
export const getMaterial = (id: number) => api.get<Material>(`/api/materials/${id}`);
export const generateMaterial = (payload: {
  area: string;
  topic: string;
  grades: number[];
  support_levels: string[];
  duration_minutes: number;
  available_resources?: string;
  local_context?: string;
  format: "ficha" | "sesion";
  variant?: number;
}) => api.post<Material>("/api/materials/generate", payload);

export const listLessons = () => api.get<LessonPlan[]>("/api/lessons");
export const generateLesson = (payload: {
  area: string;
  topic: string;
  grades: number[];
  support_levels: string[];
  duration_minutes: number;
  available_resources?: string;
  local_context?: string;
  variant?: number;
}) => api.post<LessonPlan>("/api/lessons/generate", payload);

export const getRadarSummary = () => api.get<RadarSummary>("/api/radar/summary");
