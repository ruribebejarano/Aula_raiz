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
    description: "Red Wi-Fi propia del colegio: funciona sin internet.",
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
    description: "Competencias reales del CNEB (Minedu): quien necesita reforzar que.",
    icon: ClipboardCheck,
    to: "/estudiantes?tab=diagnostico",
    accent: {
      bg: "bg-forest-100",
      text: "text-forest-800",
      ring: "hover:border-forest-700",
      solid: "bg-forest-800",
    },
  },
  {
    key: "radar-educativo",
    name: "RADAR EDUCATIVO",
    tagline: "Seguimiento del progreso",
    description: "Radar real por competencia: fuerte vs. flojo, de un vistazo.",
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
    key: "biblioteca-ia",
    name: "BIBLIOTECA IA",
    tagline: "Cuentos y problemas interactivos",
    description: "Cuentos y problemas con numeros reales, en Modo interactivo a pantalla completa.",
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
    key: "radio-aula",
    name: "RADIO AULA",
    tagline: "Acceso por voz",
    description: "Lee instrucciones en voz alta: sin depender de una pantalla.",
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
