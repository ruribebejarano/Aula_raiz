import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ClipboardList, GraduationCap, Layers, Sparkles } from "lucide-react";
import { getDashboard, getHealth } from "../api/endpoints";
import type { DashboardSummary, Health } from "../api/types";
import { Card, ErrorState, LoadingState, Button, DemoTag } from "../components/Common";
import { MODULES } from "../lib/modules";

export default function Dashboard() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    setError(null);
    Promise.all([getDashboard(), getHealth()])
      .then(([d, h]) => {
        setData(d);
        setHealth(h);
      })
      .catch((e) => setError(e.message ?? "Error desconocido"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  if (loading) return <LoadingState label="Cargando el aula..." />;
  if (error || !data) return <ErrorState message={error ?? "Sin datos"} onRetry={load} />;

  const stats = [
    { label: "Estudiantes activos", value: data.active_students, icon: GraduationCap },
    { label: "Diagnosticos registrados", value: data.assessments_count, icon: ClipboardList },
    { label: "Grupos sugeridos", value: data.groups_count, icon: Layers },
    { label: "Materiales generados", value: data.materials_count, icon: Sparkles },
  ];

  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-forest-800 text-ivory-50 px-6 py-7 md:px-9 md:py-9 mb-6">
        <div
          className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-forest-600/40 blur-2xl"
          aria-hidden
        />
        <div
          className="absolute -right-4 bottom-0 w-32 h-32 rounded-full bg-terracotta-500/20 blur-2xl"
          aria-hidden
        />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-forest-100/70 font-semibold">
              {data.school_name}
            </p>
            <h2 className="text-2xl md:text-3xl font-display font-extrabold mt-1">
              Tu ecosistema AULA RAIZ
            </h2>
            <p className="text-sm text-forest-100/80 mt-2 max-w-md">
              Diagnostica, agrupa, genera materiales y sigue el avance de tu aula multigrado,
              sin depender de internet externo.
            </p>
          </div>
          {data.is_demo_data && <DemoTag />}
        </div>
      </div>

      {/* Modulos */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {MODULES.map((m, idx) => {
          const Icon = m.icon;
          return (
            <Link
              key={m.key}
              to={m.to}
              style={{ animationDelay: `${idx * 40}ms` }}
              className={`animate-fade-up group block bg-white rounded-xl border border-forest-100 shadow-sm p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lift ${m.accent.ring}`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${m.accent.bg} ${m.accent.text}`}
              >
                <Icon size={20} strokeWidth={2.2} />
              </div>
              <h3 className="font-display font-bold text-forest-800 mt-3">{m.name}</h3>
              <p className="text-xs font-semibold text-forest-700/60 mt-0.5">{m.tagline}</p>
              <p className="text-sm text-forest-700/75 mt-2 leading-snug">{m.description}</p>
              <span
                className={`inline-flex items-center gap-1 text-xs font-semibold mt-3 ${m.accent.text} opacity-0 group-hover:opacity-100 transition-opacity`}
              >
                Abrir <ArrowRight size={14} />
              </span>
            </Link>
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-forest-50 text-forest-700 flex items-center justify-center shrink-0">
                <Icon size={18} strokeWidth={2.2} />
              </div>
              <div>
                <p className="text-2xl font-display font-extrabold text-forest-800 leading-none">
                  {s.value}
                </p>
                <p className="text-[11px] text-forest-700/70 mt-1">{s.label}</p>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <Card>
          <h3 className="font-display font-bold text-forest-800 mb-2">Estado de AULA BOX</h3>
          <ul className="text-sm space-y-1 text-forest-700/80">
            <li>Servidor local: {health ? "conectado" : "sin verificar"}</li>
            <li>Internet externo: {health?.internet_external ?? "no verificado"}</li>
            <li>Motor IA: {health?.ai_mode ?? "verificando..."}</li>
          </ul>
          <p className="text-xs text-forest-700/60 mt-3">
            AULA BOX es la computadora local que sirve esta aplicacion por Wi-Fi. El celular del
            docente se conecta a esa red, sin necesidad de internet externo.
          </p>
        </Card>

        <Card>
          <h3 className="font-display font-bold text-forest-800 mb-2">Pendientes de revision</h3>
          {data.pending_review > 0 ? (
            <p className="text-sm text-forest-700/80">
              {data.pending_review} estudiante(s) aun no tienen un diagnostico registrado.
            </p>
          ) : (
            <p className="text-sm text-forest-700/80">
              Todos los estudiantes activos tienen al menos un resultado registrado.
            </p>
          )}
          <Link to="/diagnostico">
            <Button className="mt-3">Registrar diagnostico</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
