import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-forest-100 shadow-sm p-5 ${className}`}
    >
      {children}
    </div>
  );
}

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-forest-800">{title}</h2>
      {subtitle && <p className="text-forest-700/70 mt-1 text-sm">{subtitle}</p>}
    </div>
  );
}

export function LoadingState({ label = "Cargando..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-16 text-forest-700/70">
      <span className="animate-pulse">{label}</span>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 border-2 border-dashed border-forest-100 rounded-xl">
      <p className="font-semibold text-forest-800">{title}</p>
      {description && <p className="text-sm text-forest-700/70 mt-1 max-w-md">{description}</p>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4 bg-terracotta-100 border border-terracotta-400 rounded-xl">
      <p className="font-semibold text-terracotta-600">No se pudo cargar la informacion</p>
      <p className="text-sm text-forest-800/70 mt-1 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 px-4 py-2 rounded-lg bg-terracotta-500 text-white text-sm font-medium hover:bg-terracotta-600"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}

export function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  const base = "px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const styles = {
    primary: "bg-forest-600 text-white hover:bg-forest-700",
    secondary: "bg-terracotta-500 text-white hover:bg-terracotta-600",
    ghost: "bg-transparent text-forest-700 border border-forest-100 hover:bg-forest-50",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function SupportBadge({ level }: { level: string }) {
  const map: Record<string, string> = {
    "Requiere acompanamiento prioritario": "bg-terracotta-100 text-terracotta-600 border-terracotta-400",
    "En desarrollo": "bg-amber-50 text-amber-700 border-amber-300",
    "Desempeno esperado para esta actividad": "bg-forest-50 text-forest-700 border-forest-100",
  };
  const style = map[level] ?? "bg-gray-100 text-gray-700 border-gray-300";
  return (
    <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full border ${style}`}>
      {level}
    </span>
  );
}

export function DemoTag() {
  return (
    <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-terracotta-100 text-terracotta-600 border border-terracotta-400">
      Datos de demostracion
    </span>
  );
}
