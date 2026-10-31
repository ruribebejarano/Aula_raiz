import {
  BookOpenText,
  ClipboardCheck,
  Radar as RadarIcon,
  ServerCog,
  Volume2,
  type LucideIcon,
} from "lucide-react";

export interface ModuleInfo {
  key: string;
  name: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  to: string;
  accent: {
    bg: string; // fondo suave para tarjetas/badges
    text: string; // texto/icono
    ring: string; // borde/hover
    solid: string; // fondo solido (para iconos circulares)
  };
}

export const MODULES: ModuleInfo[] = [
  {
    key: "aula-box",
    name: "AULA BOX",
    tagline: "El centro local del sistema",
    description:
      "Corre en una computadora del colegio y crea una red Wi-Fi propia: todo funciona aunque no haya internet.",
    icon: ServerCog,
    to: "/configuracion",
    accent: {
      bg: "bg-forest-50",
      text: "text-forest-700",
      ring: "hover:border-forest-600",
      solid: "bg-forest-700",
    },
  },
  {
    key: "nivela-ai",
    name: "NIVELA AI",
    tagline: "Diagnostico y agrupacion",
    description:
      "Organiza en minutos que competencias domina cada estudiante y a quien conviene reforzar primero.",
    icon: ClipboardCheck,
    to: "/diagnostico",
    accent: {
      bg: "bg-forest-100",
      text: "text-forest-800",
      ring: "hover:border-forest-700",
      solid: "bg-forest-800",
    },
  },
  {
    key: "biblioteca-ia",
    name: "BIBLIOTECA IA",
    tagline: "Sesiones y fichas listas",
    description:
      "Genera fichas y sesiones diferenciadas por nivel, contextualizadas y listas para fotocopiar.",
    icon: BookOpenText,
    to: "/biblioteca",
    accent: {
      bg: "bg-terracotta-100",
      text: "text-terracotta-600",
      ring: "hover:border-terracotta-500",
      solid: "bg-terracotta-500",
    },
  },
  {
    key: "radar-educativo",
    name: "RADAR EDUCATIVO",
    tagline: "Seguimiento del progreso",
    description:
      "Muestra la evolucion de la clase y que competencias conviene reforzar, con alertas orientativas.",
    icon: RadarIcon,
    to: "/radar",
    accent: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      ring: "hover:border-amber-400",
      solid: "bg-amber-500",
    },
  },
  {
    key: "radio-aula",
    name: "RADIO AULA",
    tagline: "Acceso por voz",
    description:
      "Lee instrucciones y actividades en voz alta, para llegar tambien sin depender de una pantalla.",
    icon: Volume2,
    to: "/biblioteca",
    accent: {
      bg: "bg-forest-50",
      text: "text-forest-600",
      ring: "hover:border-forest-600",
      solid: "bg-forest-600",
    },
  },
];
