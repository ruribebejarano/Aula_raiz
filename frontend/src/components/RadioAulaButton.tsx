import { Square, Volume2, VolumeX } from "lucide-react";
import { useSpeech } from "../hooks/useSpeech";

export default function RadioAulaButton({ text }: { text: string }) {
  const { supported, state, speak, stop } = useSpeech();

  if (!supported) {
    return (
      <div className="no-print flex items-center gap-2 text-xs text-forest-700/70 border border-dashed border-forest-100 rounded-lg px-3 py-2">
        <VolumeX size={14} />
        RADIO AULA no esta disponible en este navegador. Puedes leer el texto directamente en
        pantalla o imprimir la ficha.
      </div>
    );
  }

  return (
    <div className="no-print flex items-center gap-2">
      {state === "speaking" ? (
        <button
          onClick={stop}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-terracotta-500 text-white text-sm font-semibold hover:bg-terracotta-600 transition-all active:scale-95 shadow-sm"
        >
          <Square size={15} /> Detener
        </button>
      ) : (
        <button
          onClick={() => speak(text)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-forest-600 text-white text-sm font-semibold hover:bg-forest-700 transition-all active:scale-95 shadow-sm"
        >
          <Volume2 size={15} /> Escuchar
        </button>
      )}
      <span className="text-xs text-forest-700/60 hidden sm:inline">
        RADIO AULA: lee el contenido en voz alta
      </span>
    </div>
  );
}
