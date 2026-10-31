import { useState } from "react";
import { BookOpenText, Sparkles, Volume2, X } from "lucide-react";
import { useSpeech } from "../hooks/useSpeech";

interface StoryModeProps {
  titulo: string;
  area: string;
  partes: string[];
  preguntaInteractiva: string;
  respuestaClave?: string | null;
  onClose: () => void;
}

type Step = { label: string; text: string; isPause?: boolean };

/**
 * Convierte el cuento/situacion generado por BIBLIOTECA IA en una experiencia
 * de lectura a pantalla completa, parte por parte, con una pausa interactiva
 * real antes del cierre (tecnica antes/durante/despues de la lectura). El
 * docente puede proyectar esto y usarlo en vivo con el salon.
 */
export default function StoryMode({
  titulo,
  area,
  partes,
  preguntaInteractiva,
  respuestaClave,
  onClose,
}: StoryModeProps) {
  const isComunicacion = area?.toLowerCase().startsWith("com");
  const { supported, state, speak, stop } = useSpeech();
  const [step, setStep] = useState(0);

  const cleanParts = partes.filter(Boolean);
  const steps: Step[] = isComunicacion
    ? [
        ...cleanParts.slice(0, -1).map((text, i) => ({ label: `Parte ${i + 1}`, text })),
        { label: "Pausa", text: preguntaInteractiva, isPause: true },
        { label: "Final", text: cleanParts[cleanParts.length - 1] ?? "Fin del cuento." },
      ]
    : [
        { label: "Situacion", text: cleanParts[0] ?? "" },
        { label: "Pausa", text: preguntaInteractiva, isPause: true },
        {
          label: "Resultado",
          text: respuestaClave ? `La respuesta es ${respuestaClave}.` : "Revisen juntos el resultado.",
        },
      ];

  const current = steps[step];
  const isLast = step === steps.length - 1;

  const handleSpeak = () => speak(current.text);

  return (
    <div className="fixed inset-0 z-50 bg-forest-900/95 flex items-center justify-center p-4 animate-fade-up">
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.07] pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 400 400"
        aria-hidden
      >
        <path
          d="M200 400 C200 300 150 260 80 240 M200 400 C200 300 250 260 330 230 M200 320 C200 280 170 255 120 245 M200 320 C200 280 235 255 280 250"
          stroke="#f3eee1"
          strokeWidth="2"
          fill="none"
        />
      </svg>

      <button
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 text-ivory-50/80 hover:text-ivory-50 transition-colors"
        aria-label="Cerrar modo interactivo"
      >
        <X size={28} />
      </button>

      <div className="relative w-full max-w-xl">
        <div className="flex items-center justify-center gap-1.5 mb-4 flex-wrap px-6">
          {steps.map((s, i) => (
            <div
              key={`${s.label}-${i}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? "w-8 bg-terracotta-400" : i < step ? "w-4 bg-forest-100" : "w-4 bg-forest-700"
              }`}
            />
          ))}
        </div>

        <div
          className={`rounded-3xl p-7 sm:p-10 shadow-lift transition-colors duration-300 ${
            current.isPause ? "bg-amber-50" : "bg-ivory-50"
          }`}
        >
          <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider">
            {current.isPause ? (
              <Sparkles size={16} className="text-amber-600" />
            ) : (
              <BookOpenText size={16} className="text-forest-700" />
            )}
            <span className={current.isPause ? "text-amber-700" : "text-forest-700"}>
              {current.isPause ? "Pausa interactiva — pregunta al aula" : `${current.label} · ${titulo}`}
            </span>
          </div>

          <p
            className={`whitespace-pre-line leading-relaxed ${
              current.isPause
                ? "text-xl sm:text-2xl font-display font-bold text-amber-900"
                : "text-lg sm:text-xl text-forest-900"
            }`}
          >
            {current.text}
          </p>

          <div className="flex items-center justify-between mt-7 flex-wrap gap-3">
            {supported ? (
              <button
                onClick={state === "speaking" ? stop : handleSpeak}
                className="flex items-center gap-1.5 text-sm font-semibold text-forest-700 hover:text-forest-800"
              >
                <Volume2 size={16} />
                {state === "speaking" ? "Detener" : "Escuchar"}
              </button>
            ) : (
              <span />
            )}

            {isLast ? (
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg bg-forest-700 text-white text-sm font-semibold hover:bg-forest-800 transition-all active:scale-95"
              >
                Terminar
              </button>
            ) : (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="px-5 py-2.5 rounded-lg bg-terracotta-500 text-white text-sm font-semibold hover:bg-terracotta-600 transition-all active:scale-95"
              >
                {current.isPause ? "Revelar" : "Continuar"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
