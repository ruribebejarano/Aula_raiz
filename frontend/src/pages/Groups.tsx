import { useEffect, useState } from "react";
import { listGroups, moveStudentToGroup, recalculateGroups } from "../api/endpoints";
import type { LearningGroup } from "../api/types";
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  PageTitle,
  SupportBadge,
} from "../components/Common";

export default function Groups() {
  const [groups, setGroups] = useState<LearningGroup[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recalculating, setRecalculating] = useState(false);

  const load = () => {
    setError(null);
    listGroups()
      .then(setGroups)
      .catch((e) => setError(e.message ?? "Error desconocido"));
  };

  useEffect(load, []);

  const recalc = async () => {
    setRecalculating(true);
    try {
      const updated = await recalculateGroups();
      setGroups(updated);
    } catch (e: any) {
      setError(e.message ?? "No se pudo recalcular.");
    } finally {
      setRecalculating(false);
    }
  };

  const grouped = groupBy(groups ?? [], (g) => `${g.area} · ${g.competency_name}`);

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-3">
        <PageTitle
          title="Grupos de aprendizaje"
          subtitle="Sugerencia por competencia y nivel de apoyo. Siempre editable por el docente."
        />
        <Button onClick={recalc} disabled={recalculating}>
          {recalculating ? "Recalculando..." : "Recalcular agrupacion"}
        </Button>
      </div>

      {error && <ErrorState message={error} onRetry={load} />}
      {!error && !groups && <LoadingState />}
      {!error && groups && groups.length === 0 && (
        <EmptyState
          title="Aun no hay grupos sugeridos"
          description="Registra diagnosticos y presiona 'Recalcular agrupacion'."
        />
      )}

      {Object.entries(grouped).map(([compName, groupList]) => (
        <div key={compName} className="mb-6">
          <h3 className="font-semibold text-forest-800 mb-2">{compName}</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {groupList.map((g) => (
              <Card key={g.id}>
                <SupportBadge level={g.support_level} />
                <p className="text-xs text-forest-700/60 mt-2 mb-3">{g.description}</p>
                {g.members.length === 0 ? (
                  <p className="text-xs text-forest-700/50">Sin estudiantes en este grupo.</p>
                ) : (
                  <ul className="space-y-2">
                    {g.members.map((m) => (
                      <li key={m.student_id} className="flex items-center justify-between gap-2 text-sm">
                        <span>
                          {m.student_code} (grado {m.grade})
                        </span>
                        <select
                          className="text-xs border border-forest-100 rounded px-1 py-0.5"
                          value={g.id}
                          onChange={async (e) => {
                            const targetId = Number(e.target.value);
                            if (targetId === g.id) return;
                            const updated = await moveStudentToGroup(m.student_id, targetId);
                            setGroups(updated);
                          }}
                        >
                          {groupList.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                              {opt.support_level}
                            </option>
                          ))}
                        </select>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function groupBy<T>(items: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return items.reduce((acc, item) => {
    const key = keyFn(item);
    (acc[key] ??= []).push(item);
    return acc;
  }, {} as Record<string, T[]>);
}
