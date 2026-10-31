import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboard, getHealth } from "../api/endpoints";
import type { DashboardSummary, Health } from "../api/types";
import { Card, ErrorState, LoadingState, PageTitle, Button, DemoTag } from "../components/Common";

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

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageTitle
          title={`Hola, bienvenido a ${data.school_name}`}
          subtitle="Resumen del aula multigrado"
        />
        {data.is_demo_data && <DemoTag />}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Estudiantes" value={data.active_students} />
        <StatCard label="Diagnosticos" value={data.assessments_count} />
        <StatCard label="Grupos sugeridos" value={data.groups_count} />
        <StatCard label="Materiales generados" value={data.materials_count} />
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <Card>
          <h3 className="font-semibold text-forest-800 mb-2">Estado de AULA BOX</h3>
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
          <h3 className="font-semibold text-forest-800 mb-2">Pendientes de revision</h3>
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

      <div className="flex flex-wrap gap-3">
        <Link to="/estudiantes">
          <Button variant="ghost">Ver estudiantes</Button>
        </Link>
        <Link to="/grupos">
          <Button variant="ghost">Ver grupos sugeridos</Button>
        </Link>
        <Link to="/biblioteca">
          <Button variant="secondary">Crear ficha diferenciada</Button>
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card className="text-center">
      <p className="text-3xl font-bold text-forest-700">{value}</p>
      <p className="text-xs text-forest-700/70 mt-1">{label}</p>
    </Card>
  );
}
