export function LogoMark({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#1f3d2b" />
      <path
        d="M24 30 C24 22 19 17 13 15"
        stroke="#f3eee1"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M24 30 C24 21 29 16 35 14"
        stroke="#f3eee1"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M24 30 L24 40" stroke="#c9693a" strokeWidth="2.6" strokeLinecap="round" />
      <path
        d="M24 36 C20 36 17 34 16 31"
        stroke="#c9693a"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M24 33 C28 33 31 31 32 28"
        stroke="#c9693a"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="24" cy="12" r="5.5" fill="#dcebe0" />
    </svg>
  );
}

export function LogoLockup({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark />
      <div className="leading-tight">
        <p className="font-display font-extrabold text-lg tracking-tight">AULA RAIZ</p>
        <p className="text-[11px] uppercase tracking-wider opacity-70 -mt-0.5">
          Multigrado · IA local
        </p>
      </div>
    </div>
  );
}
