import { NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  BookOpenText,
  Home,
  Radar as RadarIcon,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";
import { getHealth } from "../api/endpoints";
import type { Health } from "../api/types";
import { LogoLockup, LogoMark } from "./Logo";

const NAV_ITEMS: { to: string; label: string; icon: LucideIcon }[] = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/estudiantes", label: "Estudiantes", icon: Users },
  { to: "/biblioteca", label: "Biblioteca IA", icon: BookOpenText },
  { to: "/radar", label: "Radar", icon: RadarIcon },
  { to: "/configuracion", label: "Configuracion", icon: Settings },
];

export default function Layout() {
  const [health, setHealth] = useState<Health | null>(null);
  const [healthError, setHealthError] = useState(false);

  useEffect(() => {
    let active = true;
    const check = () =>
      getHealth()
        .then((h) => active && (setHealth(h), setHealthError(false)))
        .catch(() => active && setHealthError(true));
    check();
    const interval = setInterval(check, 15000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-ivory-50 text-forest-900 flex flex-col md:flex-row">
      <aside className="no-print hidden md:flex md:w-64 md:flex-col bg-forest-800 text-ivory-50 p-5 gap-6 sticky top-0 h-screen">
        <LogoLockup />

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-forest-600 text-white shadow-soft"
                      : "text-ivory-100/85 hover:bg-forest-700 hover:translate-x-0.5"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-terracotta-400 transition-opacity ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    <Icon size={18} strokeWidth={2.2} />
                    {item.label}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto text-xs text-forest-100/70 space-y-1.5 border-t border-forest-700 pt-3">
          <StatusLine label="Servidor local" ok={!healthError && !!health} />
          <StatusLine
            label="Motor IA"
            value={health?.ai_mode ?? (healthError ? "sin conexion" : "verificando...")}
          />
        </div>
      </aside>

      <header className="no-print md:hidden bg-forest-800 text-ivory-50 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <LogoMark className="w-8 h-8" />
          <span className="font-display font-extrabold text-base tracking-tight">AULA RAIZ</span>
        </div>
        <span className="text-[11px] flex items-center gap-1.5">
          <span
            className={`inline-block w-2 h-2 rounded-full ${healthError ? "bg-red-400" : "bg-green-400"}`}
          />
          {healthError ? "Sin conexion" : health ? `IA: ${health.ai_mode}` : "..."}
        </span>
      </header>

      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 animate-fade-up">
        <Outlet />
      </main>

      <nav className="no-print md:hidden fixed bottom-0 left-0 right-0 bg-forest-800 text-ivory-50 flex justify-between px-1 py-1.5 overflow-x-auto border-t border-forest-700/60 z-10">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-1 rounded-md text-[10.5px] min-w-[56px] transition-colors duration-200 ${
                  isActive ? "bg-forest-600 text-white" : "text-ivory-100/75"
                }`
              }
            >
              <Icon size={18} strokeWidth={2.2} />
              {item.label}
            </NavLink>
          );
        })}
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
          className={`inline-block w-2 h-2 rounded-full transition-colors ${ok ? "bg-green-400" : "bg-red-400"}`}
        />
      )}
    </div>
  );
}
