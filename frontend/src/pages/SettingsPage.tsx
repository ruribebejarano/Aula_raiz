import { useEffect, useState } from "react";
import { getAISettings, getHealth, listAssessments, listStudents } from "../api/endpoints";
import type { AISettings, Health } from "../api/types";
import { Button, Card, ErrorState, LoadingState, PageTitle } from "../components/Common";

export default function SettingsPage() {
  const [health, setHealth] = useState<Health | null>(null);
  const [ai, setAi] = useState<AISettings | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setError(null);
    Promise.all([getHealth(), getAISettings()])
      .then(([h, a]) => {
        setHealth(h);
        setAi(a);
      })
      .catch((e) => setError(e.message ?? "Error desconocido"));
  };

  useEffect(load, []);

  const exportBackup = async () => {
    const [students, assessments] = await Promise.all([listStudents(), listAssessments()]);
    const blob = new Blob(
      [JSON.stringify({ exported_at: new Date().toISOString(), students, assessments }, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aula_raiz_respaldo_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!health || !ai) return <LoadingState />;

  return (
    <div>
      <PageTitle title="Configuracion" subtitle="Estado del sistema, motor de IA y respaldo local" />

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <Card>
          <h3 className="font-semibold text-forest-800 mb-2">Estado de AULA BOX</h3>
          <dl className="text-sm space-y-1">
            <Row label="Servidor local" value="Conectado" />
            <Row label="Internet externo" value={health.internet_external} />
            <Row label="Modo IA configurado" value={ai.provider_configured} />
            <Row label="Motor IA activo" value={ai.provider_active} />
          </dl>
          <p className="text-xs text-forest-700/70 mt-3">{ai.message}</p>
        </Card>

        <Card>
          <h3 className="font-semibold text-forest-800 mb-2">Privacidad y datos</h3>
          <ul className="text-sm text-forest-700/80 list-disc ml-4 space-y-1">
            <li>Los estudiantes se identifican por codigo anonimo, no por nombre completo.</li>
            <li>No se captura audio, foto ni biometria de estudiantes.</li>
            <li>Los niveles de apoyo son orientativos y requieren revision docente.</li>
            <li>No se envian datos identificables a modelos externos.</li>
          </ul>
        </Card>
      </div>

      <Card>
        <h3 className="font-semibold text-forest-800 mb-2">Respaldo local</h3>
        <p className="text-sm text-forest-700/70 mb-3">
          Descarga una copia de seguridad de estudiantes y evaluaciones en formato JSON.
        </p>
        <Button onClick={exportBackup}>Descargar respaldo</Button>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-forest-700/70">{label}</dt>
      <dd className="font-medium text-forest-800">{value}</dd>
    </div>
  );
}
