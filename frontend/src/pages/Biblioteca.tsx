import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateLesson, generateMaterial, listMaterials, listLessons } from "../api/endpoints";
import type { LessonPlan, Material } from "../api/types";
import { Button, Card, EmptyState, LoadingState, PageTitle } from "../components/Common";

const AREAS = ["Comunicacion", "Matematica"];
const SUPPORT_LEVELS = [
  "Requiere acompanamiento prioritario",
  "En desarrollo",
  "Desempeno esperado para esta actividad",
];
const GRADES = [1, 2, 3, 4, 5, 6];

export default function Biblioteca() {
  const navigate = useNavigate();
  const [format, setFormat] = useState<"ficha" | "sesion">("ficha");
  const [area, setArea] = useState(AREAS[0]);
  const [topic, setTopic] = useState("");
  const [grades, setGrades] = useState<number[]>([1, 2]);
  const [levels, setLevels] = useState<string[]>(["En desarrollo"]);
  const [duration, setDuration] = useState(45);
  const [resources, setResources] = useState("");
  const [context, setContext] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [materials, setMaterials] = useState<Material[] | null>(null);
  const [lessons, setLessons] = useState<LessonPlan[] | null>(null);

  useEffect(() => {
    listMaterials().then(setMaterials);
    listLessons().then(setLessons);
  }, []);

  const toggle = (list: number[], value: number, setter: (v: number[]) => void) => {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value].sort());
  };
  const toggleLevel = (value: string) => {
    setLevels((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || grades.length === 0) return;
    setSubmitting(true);
    setError(null);
    try {
      const payloadBase = {
        area,
        topic: topic.trim(),
        grades,
        support_levels: levels.length ? levels : ["En desarrollo"],
        duration_minutes: duration,
        available_resources: resources || undefined,
        local_context: context || undefined,
      };
      if (format === "ficha") {
        const material = await generateMaterial({ ...payloadBase, format: "ficha" });
        navigate(`/biblioteca/material/${material.id}`);
      } else {
        const lesson = await generateLesson(payloadBase);
        navigate(`/biblioteca/sesion/${lesson.id}`);
      }
    } catch (err: any) {
      setError(err.message ?? "No se pudo generar el material.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageTitle
        title="Biblioteca IA"
        subtitle="Genera una sesion o ficha diferenciada lista para imprimir"
      />

      <Card className="mb-6">
        <form onSubmit={submit} className="space-y-4">
          <div className="flex gap-2 text-sm">
            {(["ficha", "sesion"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFormat(f)}
                className={`px-3 py-1.5 rounded-lg border ${format === f ? "bg-forest-600 text-white border-forest-600" : "border-forest-100"}`}
              >
                {f === "ficha" ? "Ficha imprimible" : "Plan de sesion"}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-forest-700">Area</label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full mt-1 rounded-lg border border-forest-100 px-3 py-2 text-sm"
              >
                {AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-forest-700">Tema</label>
              <input
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ej. La vida en la chacra"
                className="w-full mt-1 rounded-lg border border-forest-100 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-forest-700">Grados presentes</label>
            <div className="flex gap-2 mt-1 flex-wrap">
              {GRADES.map((g) => (
                <label
                  key={g}
                  className={`px-3 py-1 rounded-full border text-sm cursor-pointer ${grades.includes(g) ? "bg-forest-600 text-white border-forest-600" : "border-forest-100"}`}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={grades.includes(g)}
                    onChange={() => toggle(grades, g, setGrades)}
                  />
                  {g}°
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-forest-700">Niveles de apoyo presentes</label>
            <div className="flex gap-2 mt-1 flex-wrap">
              {SUPPORT_LEVELS.map((lvl) => (
                <label
                  key={lvl}
                  className={`px-3 py-1 rounded-full border text-xs cursor-pointer ${levels.includes(lvl) ? "bg-terracotta-500 text-white border-terracotta-500" : "border-forest-100"}`}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={levels.includes(lvl)}
                    onChange={() => toggleLevel(lvl)}
                  />
                  {lvl}
                </label>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-forest-700">Duracion (minutos)</label>
              <input
                type="number"
                min={10}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full mt-1 rounded-lg border border-forest-100 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-forest-700">Recursos disponibles (opcional)</label>
              <input
                value={resources}
                onChange={(e) => setResources(e.target.value)}
                placeholder="Piedritas, cuadernos..."
                className="w-full mt-1 rounded-lg border border-forest-100 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-forest-700">Contexto local (opcional)</label>
            <input
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Chacra, feria, rio cercano..."
              className="w-full mt-1 rounded-lg border border-forest-100 px-3 py-2 text-sm"
            />
          </div>

          <Button type="submit" disabled={submitting}>
            {submitting ? "Generando..." : format === "ficha" ? "Crear ficha" : "Crear sesion"}
          </Button>
          {error && <p className="text-sm text-terracotta-600">{error}</p>}
        </form>
      </Card>

      <h3 className="font-semibold text-forest-800 mb-2">Materiales generados</h3>
      {!materials ? (
        <LoadingState />
      ) : materials.length === 0 ? (
        <EmptyState title="Aun no hay materiales generados" />
      ) : (
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          {materials.map((m) => (
            <Card
              key={m.id}
              className="cursor-pointer hover:border-forest-600"
              onClick={() => navigate(`/biblioteca/material/${m.id}`)}
            >
              <p className="font-medium text-forest-800">{m.title}</p>
              <p className="text-xs text-forest-700/60">
                {m.area} · {m.grade_range} · {m.provider === "demo" ? "Plantilla demo" : "Generado por Ollama"}
              </p>
            </Card>
          ))}
        </div>
      )}

      <h3 className="font-semibold text-forest-800 mb-2">Sesiones generadas</h3>
      {!lessons ? (
        <LoadingState />
      ) : lessons.length === 0 ? (
        <EmptyState title="Aun no hay sesiones generadas" />
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {lessons.map((l) => (
            <Card
              key={l.id}
              className="cursor-pointer hover:border-forest-600"
              onClick={() => navigate(`/biblioteca/sesion/${l.id}`)}
            >
              <p className="font-medium text-forest-800">{l.title}</p>
              <p className="text-xs text-forest-700/60">{l.duration_minutes} min</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
