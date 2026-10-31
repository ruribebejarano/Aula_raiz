import { useEffect, useMemo, useState } from "react";
import {
  createAssessment,
  getRuleExplanation,
  listCompetencies,
  listStudents,
} from "../api/endpoints";
import type { Assessment, Competency, Student } from "../api/types";
import { Button, Card, CnebBadge, LoadingState, PageTitle, SupportBadge } from "../components/Common";

const QUIZ_ITEMS = [
  "Pregunta de ejemplo 1: resolvio correctamente el primer ejercicio.",
  "Pregunta de ejemplo 2: resolvio correctamente el segundo ejercicio.",
  "Pregunta de ejemplo 3: explico su procedimiento con claridad.",
  "Pregunta de ejemplo 4: resolvio un ejercicio de mayor dificultad.",
  "Pregunta de ejemplo 5: aplico lo aprendido a una situacion nueva.",
];

export default function Diagnostico() {
  const [students, setStudents] = useState<Student[]>([]);
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [rule, setRule] = useState<string>("");
  const [mode, setMode] = useState<"quiz" | "manual">("quiz");

  const [studentId, setStudentId] = useState<number | "">("");
  const [competencyId, setCompetencyId] = useState<number | "">("");
  const [notes, setNotes] = useState("");
  const [answers, setAnswers] = useState<boolean[]>(Array(QUIZ_ITEMS.length).fill(false));
  const [manualScore, setManualScore] = useState(0);
  const [manualMax, setManualMax] = useState(100);

  const [result, setResult] = useState<Assessment | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([listStudents(), listCompetencies(), getRuleExplanation()]).then(
      ([s, c, r]) => {
        setStudents(s);
        setCompetencies(c);
        setRule(r.explanation);
      }
    );
  }, []);

  const quizScore = useMemo(() => answers.filter(Boolean).length, [answers]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !competencyId) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload =
        mode === "quiz"
          ? {
              student_id: studentId,
              competency_id: competencyId,
              score: quizScore,
              max_score: QUIZ_ITEMS.length,
              notes: notes || undefined,
              source: "quiz_demo",
            }
          : {
              student_id: studentId,
              competency_id: competencyId,
              score: manualScore,
              max_score: manualMax,
              notes: notes || undefined,
              source: "manual",
            };
      const res = await createAssessment(payload);
      setResult(res);
    } catch (err: any) {
      setSubmitError(err.message ?? "No se pudo registrar el diagnostico.");
    } finally {
      setSubmitting(false);
    }
  };

  if (students.length === 0 || competencies.length === 0) return <LoadingState />;

  return (
    <div>
      <PageTitle
        title="Diagnostico NIVELA AI"
        subtitle="Registra un resultado breve y obten un nivel de apoyo orientativo"
      />

      <Card className="mb-6">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-forest-700">Estudiante</label>
              <select
                required
                value={studentId}
                onChange={(e) => setStudentId(Number(e.target.value))}
                className="w-full mt-1 rounded-lg border border-forest-100 px-3 py-2 text-sm"
              >
                <option value="">Selecciona...</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.student_code} · grado {s.grade}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-forest-700">Competencia</label>
              <select
                required
                value={competencyId}
                onChange={(e) => setCompetencyId(Number(e.target.value))}
                className="w-full mt-1 rounded-lg border border-forest-100 px-3 py-2 text-sm"
              >
                <option value="">Selecciona...</option>
                {competencies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.area} · {c.name}
                  </option>
                ))}
              </select>
              {competencyId !== "" && (
                <div className="mt-1.5">
                  <CnebBadge
                    source={competencies.find((c) => c.id === competencyId)?.curricular_source}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 text-sm">
            <button
              type="button"
              onClick={() => setMode("quiz")}
              className={`px-3 py-1.5 rounded-lg border ${mode === "quiz" ? "bg-forest-600 text-white border-forest-600" : "border-forest-100"}`}
            >
              Preguntas rapidas (demo)
            </button>
            <button
              type="button"
              onClick={() => setMode("manual")}
              className={`px-3 py-1.5 rounded-lg border ${mode === "manual" ? "bg-forest-600 text-white border-forest-600" : "border-forest-100"}`}
            >
              Puntaje de una actividad en papel
            </button>
          </div>

          {mode === "quiz" ? (
            <div className="space-y-2">
              {QUIZ_ITEMS.map((q, idx) => (
                <label key={idx} className="flex items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={answers[idx]}
                    onChange={(e) => {
                      const next = [...answers];
                      next[idx] = e.target.checked;
                      setAnswers(next);
                    }}
                    className="mt-1"
                  />
                  <span>{q}</span>
                </label>
              ))}
              <p className="text-xs text-forest-700/70">
                Puntaje actual: {quizScore} / {QUIZ_ITEMS.length}
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-forest-700">Puntaje obtenido</label>
                <input
                  type="number"
                  min={0}
                  value={manualScore}
                  onChange={(e) => setManualScore(Number(e.target.value))}
                  className="w-full mt-1 rounded-lg border border-forest-100 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-forest-700">Puntaje maximo</label>
                <input
                  type="number"
                  min={1}
                  value={manualMax}
                  onChange={(e) => setManualMax(Number(e.target.value))}
                  className="w-full mt-1 rounded-lg border border-forest-100 px-3 py-2 text-sm"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-forest-700">Observaciones (opcional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full mt-1 rounded-lg border border-forest-100 px-3 py-2 text-sm"
              rows={2}
            />
          </div>

          <Button type="submit" disabled={submitting}>
            {submitting ? "Registrando..." : "Registrar diagnostico"}
          </Button>
          {submitError && <p className="text-sm text-terracotta-600">{submitError}</p>}
        </form>
      </Card>

      {result && (
        <Card className="mb-6 border-forest-600">
          <h3 className="font-semibold text-forest-800 mb-2">Resultado orientativo</h3>
          <div className="flex items-center gap-3 mb-2">
            <SupportBadge level={result.support_level} />
            <span className="text-sm text-forest-700/80">
              {result.score}/{result.max_score} puntos ({result.score_pct}%)
            </span>
          </div>
          <p className="text-xs text-forest-700/70">
            Evidencia: resultado registrado para {result.student_code} en {result.competency_name}
            {" "}
            el {result.assessment_date}. Puedes corregir este registro si no refleja lo observado.
          </p>
        </Card>
      )}

      <Card className="mb-6">
        <h3 className="font-semibold text-forest-800 mb-2">Regla de clasificacion (transparente)</h3>
        <p className="text-sm text-forest-700/80">{rule}</p>
      </Card>

      <Card className="bg-forest-50/50 border-forest-100">
        <div className="flex items-center gap-2 mb-2">
          <CnebBadge source="Curriculo Nacional de la Educacion Basica (CNEB), Minedu 2016" />
          <h3 className="font-semibold text-forest-800">De donde salen estas competencias</h3>
        </div>
        <p className="text-sm text-forest-700/80">
          Los nombres de las competencias (por ejemplo, "Resuelve problemas de cantidad" o "Lee
          diversos tipos de textos escritos en su lengua materna") estan tomados tal cual del
          Curriculo Nacional de la Educacion Basica del Minedu, no son etiquetas inventadas para
          la demo. Los umbrales de puntaje si son ilustrativos del prototipo.
        </p>
      </Card>
    </div>
  );
}
