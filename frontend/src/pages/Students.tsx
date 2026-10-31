import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createStudent, listStudents } from "../api/endpoints";
import type { Student } from "../api/types";
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  PageTitle,
  SupportBadge,
} from "../components/Common";

export default function Students() {
  const [students, setStudents] = useState<Student[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    setError(null);
    listStudents()
      .then(setStudents)
      .catch((e) => setError(e.message ?? "Error desconocido"));
  };

  useEffect(load, []);

  return (
    <div>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <PageTitle title="Estudiantes" subtitle="Lista con codigo anonimo, grado y ultimo resultado" />
        <Button onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Cancelar" : "+ Registrar estudiante"}
        </Button>
      </div>

      {showForm && (
        <NewStudentForm
          onCreated={() => {
            setShowForm(false);
            load();
          }}
        />
      )}

      {error && <ErrorState message={error} onRetry={load} />}
      {!error && !students && <LoadingState />}
      {!error && students && students.length === 0 && (
        <EmptyState title="Aun no hay estudiantes registrados" description="Registra el primero con el boton de arriba." />
      )}

      {students && students.length > 0 && (
        <div className="grid gap-3">
          {students.map((s) => (
            <Link key={s.id} to={`/estudiantes/${s.id}`}>
              <Card className="flex flex-wrap items-center justify-between gap-3 hover:border-forest-600 transition-colors">
                <div>
                  <p className="font-semibold text-forest-800">{s.student_code}</p>
                  <p className="text-xs text-forest-700/70">
                    Grado {s.grade}
                    {s.classroom_group ? ` · Grupo ${s.classroom_group}` : ""}
                  </p>
                </div>
                <div className="text-right">
                  {s.last_competency ? (
                    <>
                      <p className="text-xs text-forest-700/70">{s.last_competency}</p>
                      <SupportBadge level={s.last_support_level ?? ""} />
                    </>
                  ) : (
                    <span className="text-xs text-forest-700/50">Sin diagnostico aun</span>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function NewStudentForm({ onCreated }: { onCreated: () => void }) {
  const [code, setCode] = useState("");
  const [grade, setGrade] = useState(1);
  const [group, setGroup] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      await createStudent({
        student_code: code.trim(),
        grade,
        classroom_group: group.trim() || null,
      });
      setCode("");
      setGroup("");
      onCreated();
    } catch (err: any) {
      setFormError(err.message ?? "No se pudo registrar el estudiante.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="mb-6">
      <form onSubmit={submit} className="grid sm:grid-cols-4 gap-3 items-end">
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-forest-700">Codigo anonimo</label>
          <input
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="E-013"
            className="w-full mt-1 rounded-lg border border-forest-100 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-forest-700">Grado</label>
          <select
            value={grade}
            onChange={(e) => setGrade(Number(e.target.value))}
            className="w-full mt-1 rounded-lg border border-forest-100 px-3 py-2 text-sm"
          >
            {[1, 2, 3, 4, 5, 6].map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-forest-700">Grupo de aula (opcional)</label>
          <input
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            placeholder="A"
            className="w-full mt-1 rounded-lg border border-forest-100 px-3 py-2 text-sm"
          />
        </div>
        <div className="sm:col-span-4">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Guardando..." : "Guardar estudiante"}
          </Button>
          {formError && <p className="text-sm text-terracotta-600 mt-2">{formError}</p>}
          <p className="text-xs text-forest-700/60 mt-2">
            No usar nombres completos. El codigo anonimo protege la identidad del estudiante.
          </p>
        </div>
      </form>
    </Card>
  );
}
