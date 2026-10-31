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
      <div className="relative overflow-hidden rounded-[28px] bg-forest-800 text-ivory-50 px-6 py-7 md:px-9 md:py-9 mb-6">
        <svg
          className="absolute -right-6 -top-4 h-full w-2/3 max-w-sm opacity-20 pointer-events-none"
          viewBox="0 0 300 300"
          fill="none"
          aria-hidden
        >
          <path
            d="M150 10 C150 90 150 150 150 290 M150 150 C150 150 90 170 60 230 M150 150 C150 150 210 170 250 220 M150 100 C150 100 110 115 85 150 M150 100 C150 100 195 115 225 145 M150 200 C150 200 115 215 95 260"
            stroke="#f3eee1"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="150" cy="10" r="7" fill="#c9693a" />
        </svg>
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
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 lg:auto-rows-fr">
        {MODULES.map((m, idx) => {
          const Icon = m.icon;
          const featured = m.key === "biblioteca-ia";
          return (
            <Link
              key={m.key}
              to={m.to}
              style={{ animationDelay: `${idx * 40}ms` }}
              className={`animate-fade-up group block rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lift ${
                featured
                  ? "lg:col-span-2 bg-forest-800 text-ivory-50 shadow-lift"
                  : `bg-white border border-forest-100 shadow-sm ${m.accent.ring}`
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  featured ? "bg-terracotta-500 text-white" : `${m.accent.bg} ${m.accent.text}`
                }`}
              >
                <Icon size={20} strokeWidth={2.2} />
              </div>
              <h3 className={`font-display font-bold mt-3 ${featured ? "text-ivory-50 text-lg" : "text-forest-800"}`}>
                {m.name}
              </h3>
              <p className={`text-xs font-semibold mt-0.5 ${featured ? "text-terracotta-300" : "text-forest-700/60"}`}>
                {m.tagline}
              </p>
              <p className={`text-sm mt-2 leading-snug ${featured ? "text-ivory-100/85 max-w-md" : "text-forest-700/75"}`}>
                {m.description}
              </p>
              <span
                className={`inline-flex items-center gap-1 text-xs font-semibold mt-3 opacity-0 group-hover:opacity-100 transition-opacity ${
                  featured ? "text-terracotta-300" : m.accent.text
                }`}
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
