import type { ReactNode } from "react";
import { AlertTriangle, Inbox, Loader2 } from "lucide-react";

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
      className={`bg-white rounded-xl border border-forest-100 shadow-sm p-5 transition-shadow duration-200 ${
        onClick ? "cursor-pointer hover:shadow-lift hover:-translate-y-0.5 transition-transform" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6 animate-fade-up">
      <h2 className="text-2xl font-display font-extrabold text-forest-800">{title}</h2>
      {subtitle && <p className="text-forest-700/70 mt-1 text-sm">{subtitle}</p>}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-forest-100/70 ${className}`} />;
}

export function LoadingState({ label = "Cargando..." }: { label?: string }) {
  return (
    <div className="py-10">
      <div className="flex items-center gap-2 text-forest-700/70 mb-6 justify-center">
        <Loader2 size={16} className="animate-spin" />
        <span>{label}</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 border-2 border-dashed border-forest-100 rounded-xl bg-forest-50/40">
      <div className="w-10 h-10 rounded-full bg-forest-100 text-forest-600 flex items-center justify-center mb-3">
        <Inbox size={18} />
      </div>
      <p className="font-semibold text-forest-800">{title}</p>
      {description && <p className="text-sm text-forest-700/70 mt-1 max-w-md">{description}</p>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4 bg-terracotta-100 border border-terracotta-400 rounded-xl">
      <div className="w-10 h-10 rounded-full bg-white text-terracotta-600 flex items-center justify-center mb-2">
        <AlertTriangle size={18} />
      </div>
      <p className="font-semibold text-terracotta-600">No se pudo cargar la informacion</p>
      <p className="text-sm text-forest-800/70 mt-1 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 px-4 py-2 rounded-lg bg-terracotta-500 text-white text-sm font-medium hover:bg-terracotta-600 transition-colors active:scale-95"
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
  const base =
    "px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
  const styles = {
    primary: "bg-forest-600 text-white hover:bg-forest-700 shadow-sm hover:shadow-soft",
    secondary: "bg-terracotta-500 text-white hover:bg-terracotta-600 shadow-sm hover:shadow-soft",
    ghost: "bg-transparent text-forest-700 border border-forest-100 hover:bg-forest-50 hover:border-forest-600",
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
    <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full border transition-colors ${style}`}>
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

const GRADE_STYLES = [
  "bg-forest-100 text-forest-700 border-forest-600",
  "bg-terracotta-100 text-terracotta-600 border-terracotta-500",
  "bg-amber-50 text-amber-700 border-amber-400",
];

export function GradeBadge({ grade, className = "" }: { grade: number; className?: string }) {
  const style = GRADE_STYLES[grade % GRADE_STYLES.length];
  return (
    <span
      className={`inline-flex items-center justify-center w-9 h-9 rounded-full font-display font-extrabold text-sm border-2 shrink-0 ${style} ${className}`}
    >
      {grade}°
    </span>
  );
}

export function CnebBadge({ source }: { source?: string | null }) {
  if (!source) return null;
  return (
    <span
      title={source}
      className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-forest-800 text-ivory-50"
    >
      CNEB · Minedu
    </span>
  );
}
