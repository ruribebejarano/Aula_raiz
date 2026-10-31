import { useCallback, useEffect, useState } from "react";

type SpeechState = "idle" | "speaking" | "paused";

export function useSpeech() {
  const [supported, setSupported] = useState(false);
  const [state, setState] = useState<SpeechState>("idle");

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!supported) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "es-PE";
      utterance.rate = 0.95;
      utterance.onstart = () => setState("speaking");
      utterance.onend = () => setState("idle");
      utterance.onerror = () => setState("idle");
      window.speechSynthesis.speak(utterance);
    },
    [supported]
  );

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setState("idle");
  }, [supported]);

  return { supported, state, speak, stop };
}
