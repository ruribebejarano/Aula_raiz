import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getRadarSummary } from "../api/endpoints";
import type { RadarSummary } from "../api/types";
import { Card, EmptyState, ErrorState, LoadingState, PageTitle } from "../components/Common";

const SUPPORT_COLORS: Record<string, string> = {
  "Requiere acompanamiento prioritario": "#c9693a",
  "En desarrollo": "#d9a94f",
  "Desempeno esperado para esta actividad": "#2f5d3f",
};

export default function Radar() {
  const [data, setData] = useState<RadarSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setError(null);
    getRadarSummary()
      .then(setData)
      .catch((e) => setError(e.message ?? "Error desconocido"));
  };

  useEffect(load, []);

  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!data) return <LoadingState />;

  return (
    <div>
      <PageTitle
        title="Radar educativo"
        subtitle="Seguimiento descriptivo. Las recomendaciones son orientativas, no diagnosticos automaticos."
      />

      <Card className="mb-6">
        <h3 className="font-semibold text-forest-800 mb-1">Siguiente accion recomendada</h3>
        <p className="text-sm text-forest-700/80">{data.recommended_next_action}</p>
      </Card>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <Card>
          <h3 className="font-semibold text-forest-800 mb-3">Promedio por competencia (%)</h3>
          {data.by_competency.length === 0 ? (
            <EmptyState title="Aun no hay resultados suficientes" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.by_competency} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis
                  type="category"
                  dataKey="competency_name"
                  width={140}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip />
                <Bar dataKey="average_pct" fill="#2f5d3f" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card>
          <h3 className="font-semibold text-forest-800 mb-3">Distribucion de niveles de apoyo</h3>
          {data.support_distribution.length === 0 ? (
            <EmptyState title="Aun no hay resultados suficientes" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={data.support_distribution}
                  dataKey="count"
                  nameKey="support_level"
                  outerRadius={100}
                  label={({ count }) => `${count}`}
                >
                  {data.support_distribution.map((entry, idx) => (
                    <Cell key={idx} fill={SUPPORT_COLORS[entry.support_level] ?? "#999"} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      <Card>
        <h3 className="font-semibold text-forest-800 mb-2">Conviene reforzar</h3>
        <ul className="space-y-1 text-sm">
          {data.by_competency
            .filter((c) => c.needs_reinforcement)
            .map((c) => (
              <li key={c.competency_id} className="flex justify-between border-b border-forest-50 py-1">
                <span>
                  {c.area} · {c.competency_name}
                </span>
                <span className="font-semibold text-terracotta-600">{c.average_pct}%</span>
              </li>
            ))}
          {data.by_competency.every((c) => !c.needs_reinforcement) && (
            <p className="text-forest-700/70">Ninguna competencia requiere refuerzo inmediato.</p>
          )}
        </ul>

        {data.students_pending_review.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-forest-800">Pendientes de revision</h4>
            <p className="text-sm text-forest-700/70">
              {data.students_pending_review.join(", ")}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
