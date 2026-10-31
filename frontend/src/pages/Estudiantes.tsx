import { Blocks, ClipboardCheck, Users } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { PageTitle } from "../components/Common";
import Students from "./Students";
import Diagnostico from "./Diagnostico";
import Groups from "./Groups";

const TABS = [
  { key: "lista", label: "Lista", icon: Users },
  { key: "diagnostico", label: "Diagnostico (NIVELA AI)", icon: ClipboardCheck },
  { key: "grupos", label: "Grupos", icon: Blocks },
] as const;

type TabKey = (typeof TABS)[number]["key"];

/**
 * Antes Estudiantes, Diagnostico y Grupos eran 3 items de navegacion
 * separados. Viven juntos aqui porque son el mismo flujo de trabajo del
 * docente: ver a sus estudiantes, diagnosticarlos, revisar como quedaron
 * agrupados — menos opciones en el menu, mismo contenido.
 */
export default function Estudiantes() {
  const [params, setParams] = useSearchParams();
  const tab = (params.get("tab") as TabKey) ?? "lista";

  const setTab = (key: TabKey) => setParams(key === "lista" ? {} : { tab: key });

  return (
    <div>
      <PageTitle title="Estudiantes" />
      <div className="flex gap-1 mb-6 border-b border-forest-100 no-print overflow-x-auto">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px whitespace-nowrap transition-colors ${
                active
                  ? "border-terracotta-500 text-forest-800"
                  : "border-transparent text-forest-700/60 hover:text-forest-800"
              }`}
            >
              <Icon size={16} />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "lista" && <Students />}
      {tab === "diagnostico" && <Diagnostico />}
      {tab === "grupos" && <Groups />}
    </div>
  );
}
