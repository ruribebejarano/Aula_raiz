import { NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { getHealth } from "../api/endpoints";
import type { Health } from "../api/types";

const NAV_ITEMS = [
  { to: "/", label: "Inicio", icon: "🏠" },
  { to: "/estudiantes", label: "Estudiantes", icon: "🧒" },
  { to: "/diagnostico", label: "Diagnostico", icon: "📝" },
  { to: "/grupos", label: "Grupos", icon: "🧩" },
  { to: "/biblioteca", label: "Biblioteca IA", icon: "📚" },
  { to: "/radar", label: "Radar", icon: "📊" },
  { to: "/configuracion", label: "Configuracion", icon: "⚙️" },
];

export default function Layout() {
  const [health, setHealth] = useState<Health | null>(null);
  const [healthError, setHealthError] = useState(false);

  useEffect(() => {
    let active = true;
    getHealth()
      .then((h) => active && setHealth(h))
      .catch(() => active && setHealthError(true));
    const interval = setInterval(() => {
      getHealth()
        .then((h) => active && (setHealth(h), setHealthError(false)))
        .catch(() => active && setHealthError(true));
    }, 15000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-ivory-50 text-forest-900 flex flex-col md:flex-row">
      <aside className="no-print hidden md:flex md:w-64 md:flex-col bg-forest-800 text-ivory-50 p-5 gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AULA RAIZ</h1>
          <p className="text-xs text-forest-100/80 mt-1">
            IA para escuelas rurales multigrado
          </p>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-forest-600 text-white"
                    : "text-ivory-100/90 hover:bg-forest-700"
                }`
              }
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto text-xs text-forest-100/70 space-y-1">
          <StatusLine label="Servidor local" ok={!healthError && !!health} />
          <StatusLine
            label="Motor IA"
            value={health?.ai_mode ?? (healthError ? "sin conexion" : "verificando...")}
          />
        </div>
      </aside>

      <header className="no-print md:hidden bg-forest-800 text-ivory-50 p-4 flex items-center justify-between">
        <h1 className="text-lg font-bold">AULA RAIZ</h1>
        <span className="text-xs">
          {healthError ? "Sin conexion local" : health ? `IA: ${health.ai_mode}` : "..."}
        </span>
      </header>

      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
        <Outlet />
      </main>

      <nav className="no-print md:hidden fixed bottom-0 left-0 right-0 bg-forest-800 text-ivory-50 flex justify-between px-1 py-1.5 overflow-x-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1 rounded-md text-[11px] min-w-[56px] ${
                isActive ? "bg-forest-600 text-white" : "text-ivory-100/80"
              }`
            }
          >
            <span aria-hidden className="text-base">
              {item.icon}
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

function StatusLine({ label, ok, value }: { label: string; ok?: boolean; value?: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span>{label}</span>
      {value ? (
        <span className="font-semibold text-ivory-50">{value}</span>
      ) : (
        <span
          className={`inline-block w-2 h-2 rounded-full ${ok ? "bg-green-400" : "bg-red-400"}`}
        />
      )}
    </div>
  );
}
