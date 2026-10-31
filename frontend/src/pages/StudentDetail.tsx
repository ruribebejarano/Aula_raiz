import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getStudent, getStudentAssessments, updateStudent } from "../api/endpoints";
import type { Assessment, Student } from "../api/types";
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  PageTitle,
  SupportBadge,
} from "../components/Common";

export default function StudentDetail() {
  const { id } = useParams<{ id: string }>();
  const studentId = Number(id);
  const [student, setStudent] = useState<Student | null>(null);
  const [assessments, setAssessments] = useState<Assessment[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setError(null);
    Promise.all([getStudent(studentId), getStudentAssessments(studentId)])
      .then(([s, a]) => {
        setStudent(s);
        setAssessments(a);
      })
      .catch((e) => setError(e.message ?? "Error desconocido"));
  };

  useEffect(load, [studentId]);

  const toggleActive = async () => {
    if (!student) return;
    const updated = await updateStudent(student.id, { active: !student.active });
    setStudent(updated);
  };

  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!student || !assessments) return <LoadingState />;

  return (
    <div>
      <Link to="/estudiantes" className="text-sm text-forest-600 underline">
        ← Volver a estudiantes
      </Link>
      <div className="flex items-start justify-between flex-wrap gap-3 mt-2">
        <PageTitle
          title={`Ficha de ${student.student_code}`}
          subtitle={`Grado ${student.grade}${student.classroom_group ? ` · Grupo ${student.classroom_group}` : ""}`}
        />
        <Button variant="ghost" onClick={toggleActive}>
          {student.active ? "Marcar inactivo" : "Marcar activo"}
        </Button>
      </div>

      <Card className="mb-6">
        <h3 className="font-semibold text-forest-800 mb-3">Historial de evaluaciones</h3>
        {assessments.length === 0 ? (
          <EmptyState
            title="Sin evaluaciones registradas"
            description="Registra un diagnostico desde la seccion Diagnostico."
          />
        ) : (
          <div className="divide-y divide-forest-100">
            {assessments.map((a) => (
              <div key={a.id} className="py-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-forest-800">{a.competency_name}</p>
                  <p className="text-xs text-forest-700/60">
                    {a.area} · {a.assessment_date} · {a.score}/{a.max_score} puntos ({a.score_pct}%)
                  </p>
                  {a.notes && <p className="text-xs text-forest-700/50 mt-1">{a.notes}</p>}
                </div>
                <SupportBadge level={a.support_level} />
              </div>
            ))}
          </div>
        )}
      </Card>

      <Link to="/diagnostico">
        <Button>Registrar nuevo diagnostico</Button>
      </Link>
    </div>
  );
}
