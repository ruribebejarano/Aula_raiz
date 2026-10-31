import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { BookOpenText, RefreshCw } from "lucide-react";
import { generateLesson, generateMaterial, listLessons, listMaterials } from "../api/endpoints";
import type { LessonPlan, Material } from "../api/types";
import { Button, ErrorState, LoadingState } from "../components/Common";
import RadioAulaButton from "../components/RadioAulaButton";
import StoryMode from "../components/StoryMode";

interface RegenerateState {
  regeneratePayload?: Record<string, unknown>;
  kind?: "material" | "lesson";
  variant?: number;
}

export default function MaterialView({ type }: { type: "material" | "lesson" }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [material, setMaterial] = useState<Material | null>(null);
  const [lesson, setLesson] = useState<LessonPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [storyModeOpen, setStoryModeOpen] = useState(false);

  const state = (location.state as RegenerateState | null) ?? null;

  useEffect(() => {
    if (type === "material") {
      listMaterials()
        .then((list) => {
          const found = list.find((m) => m.id === Number(id));
          if (!found) throw new Error("Material no encontrado.");
          setMaterial(found);
        })
        .catch((e) => setError(e.message));
    } else {
      listLessons()
        .then((list) => {
          const found = list.find((l) => l.id === Number(id));
          if (!found) throw new Error("Sesion no encontrada.");
          setLesson(found);
        })
        .catch((e) => setError(e.message));
    }
  }, [id, type]);

  if (error) return <ErrorState message={error} />;
  if (type === "material" && !material) return <LoadingState />;
  if (type === "lesson" && !lesson) return <LoadingState />;

  const speechText =
    type === "material" && material
      ? [
          material.content.texto_o_situacion,
          material.content.pregunta_interactiva,
          ...material.content.instrucciones,
          ...material.content.preguntas.map((p) => p.enunciado),
        ].join(". ")
      : type === "lesson" && lesson
      ? [
          lesson.content.texto_o_situacion,
          lesson.content.pregunta_interactiva,
          lesson.content.proposito,
          ...lesson.content.momentos.map((m) => m.descripcion),
        ].join(". ")
      : "";

  const regenerate = async () => {
    if (!state?.regeneratePayload) return;
    setRegenerating(true);
    const nextVariant = (state.variant ?? 0) + 1;
    try {
      if (type === "material") {
        const m = await generateMaterial({
          ...(state.regeneratePayload as any),
          format: "ficha",
          variant: nextVariant,
        });
        navigate(`/biblioteca/material/${m.id}`, {
          replace: true,
          state: { ...state, variant: nextVariant },
        });
      } else {
        const l = await generateLesson({
          ...(state.regeneratePayload as any),
          variant: nextVariant,
        });
        navigate(`/biblioteca/sesion/${l.id}`, {
          replace: true,
          state: { ...state, variant: nextVariant },
        });
      }
    } catch {
      // silencioso: el docente puede reintentar con el boton
    } finally {
      setRegenerating(false);
    }
  };

  const content = type === "material" ? material?.content : lesson?.content;

  return (
    <div>
      <div className="no-print flex items-center justify-between flex-wrap gap-3 mb-4">
        <Link to="/biblioteca" className="text-sm text-forest-600 underline">
          ← Volver a Biblioteca IA
        </Link>
        <div className="flex gap-2 flex-wrap">
          {content && (
            <Button
              variant="secondary"
              onClick={() => setStoryModeOpen(true)}
              className="flex items-center gap-1.5"
            >
              <BookOpenText size={15} />
              Modo interactivo
            </Button>
          )}
          <RadioAulaButton text={speechText} />
          {state?.regeneratePayload && (
            <Button variant="ghost" onClick={regenerate} disabled={regenerating} className="flex items-center gap-1.5">
              <RefreshCw size={15} className={regenerating ? "animate-spin" : ""} />
              {regenerating ? "Generando..." : "Generar otra version"}
            </Button>
          )}
          <Button onClick={() => window.print()}>Imprimir / Guardar PDF</Button>
        </div>
      </div>

      {type === "material" && material && <PrintableMaterial material={material} />}
      {type === "lesson" && lesson && <PrintableLesson lesson={lesson} />}

      {storyModeOpen && content && (
        <StoryMode
          titulo={content.titulo}
          area={content.area}
          texto={content.texto_o_situacion}
          preguntaInteractiva={content.pregunta_interactiva}
          respuestaClave={content.respuesta_clave}
          onClose={() => setStoryModeOpen(false)}
        />
      )}
    </div>
  );
}

function ProviderNotice({ provider, aviso }: { provider: string; aviso: string }) {
  return (
    <p className="text-xs italic text-forest-700/70 mb-4 no-print">
      {provider === "demo" ? "Contenido de demostracion — plantilla local." : "Generado por Ollama."}{" "}
      {aviso}
    </p>
  );
}

function InteractiveNote({ pregunta }: { pregunta: string }) {
  if (!pregunta) return null;
  return (
    <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm">
      <p className="text-[11px] font-bold uppercase tracking-wide text-amber-700 mb-0.5">
        Pausa interactiva
      </p>
      <p className="text-amber-900">{pregunta}</p>
    </div>
  );
}

function AnswerKeyNote({ respuesta }: { respuesta: string | null }) {
  if (!respuesta) return null;
  return (
    <p className="no-print text-xs text-forest-700/70 mb-4">
      <strong>Clave para el docente (no imprimir con los estudiantes):</strong> {respuesta}
    </p>
  );
}

function PrintableMaterial({ material }: { material: Material }) {
  const c = material.content;
  return (
    <div className="print-page bg-white rounded-xl border border-forest-100 shadow-sm p-6 md:p-10 max-w-3xl mx-auto print:border-0 print:shadow-none print:max-w-full">
      <ProviderNotice provider={material.provider} aviso={c.aviso} />
      <header className="mb-4 border-b border-forest-800 pb-3">
        <h1 className="text-xl font-bold">{c.titulo}</h1>
        <p className="text-sm">
          Area: {c.area} · Tema: {c.tema} · Grado/grupo: {c.grado_grupo}
        </p>
        <p className="text-xs mt-2">Nombre o codigo: _______________________ Fecha: ____ / ____ / ______</p>
      </header>

      <Section title="Proposito">{c.proposito}</Section>

      <Section title={c.area?.toLowerCase().startsWith("com") ? "Texto de lectura" : "Situacion"}>
        <p className="italic border-l-2 border-forest-800/30 pl-3 whitespace-pre-line">
          {c.texto_o_situacion}
        </p>
      </Section>

      <InteractiveNote pregunta={c.pregunta_interactiva} />
      <AnswerKeyNote respuesta={c.respuesta_clave} />

      <Section title="Materiales">
        <ul className="list-disc ml-5">
          {c.materiales.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </Section>

      <Section title="Instrucciones">
        <ol className="list-decimal ml-5">
          {c.instrucciones.map((ins, i) => (
            <li key={i}>{ins}</li>
          ))}
        </ol>
      </Section>

      <Section title="Actividades por grupo">
        {c.actividades_por_grupo.map((ga, i) => (
          <p key={i} className="mb-1">
            <strong>{ga.grupo}:</strong> {ga.actividad}
          </p>
        ))}
      </Section>

      <Section title="Preguntas / Ejercicios">
        <ol className="list-decimal ml-5 space-y-3">
          {c.preguntas.map((p, i) => (
            <li key={i}>
              <p>{p.enunciado}</p>
              <div className="border border-dashed border-forest-800/40 h-14 mt-1 rounded" />
              <p className="text-xs italic mt-1 no-print">Pauta: {p.pauta_de_revision}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Adaptacion">
        <p>
          <strong>Para reforzar:</strong> {c.adaptacion.reforzar}
        </p>
        <p>
          <strong>Para ampliar:</strong> {c.adaptacion.ampliar}
        </p>
      </Section>

      <p className="text-xs mt-4 italic">{c.indicacion_impresion}</p>
      <p className="text-xs mt-4 border-t border-forest-800/30 pt-2">
        Prototipo AULA RAIZ. El docente debe revisar este material antes de aplicarlo.
      </p>
    </div>
  );
}

function PrintableLesson({ lesson }: { lesson: LessonPlan }) {
  const c = lesson.content;
  return (
    <div className="print-page bg-white rounded-xl border border-forest-100 shadow-sm p-6 md:p-10 max-w-3xl mx-auto print:border-0 print:shadow-none print:max-w-full">
      <ProviderNotice provider="demo" aviso={c.aviso} />
      <header className="mb-4 border-b border-forest-800 pb-3">
        <h1 className="text-xl font-bold">{c.titulo}</h1>
        <p className="text-sm">
          Area: {c.area} · Tema: {c.tema} · Grado/grupo: {c.grado_grupo} · Duracion:{" "}
          {c.duracion_minutos} min
        </p>
      </header>

      <Section title="Proposito">{c.proposito}</Section>

      <Section title={c.area?.toLowerCase().startsWith("com") ? "Texto de lectura" : "Situacion"}>
        <p className="italic border-l-2 border-forest-800/30 pl-3 whitespace-pre-line">
          {c.texto_o_situacion}
        </p>
      </Section>

      <InteractiveNote pregunta={c.pregunta_interactiva} />
      <AnswerKeyNote respuesta={c.respuesta_clave} />

      <Section title="Materiales">
        <ul className="list-disc ml-5">
          {c.materiales.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </Section>

      <Section title="Momentos de la sesion">
        {c.momentos.map((m, i) => (
          <p key={i} className="mb-1">
            <strong>
              {m.momento} ({m.duracion_minutos} min):
            </strong>{" "}
            {m.descripcion}
          </p>
        ))}
      </Section>

      <Section title="Actividades por grupo">
        {c.actividades_por_grupo.map((ga, i) => (
          <p key={i} className="mb-1">
            <strong>{ga.grupo}:</strong> {ga.actividad}
          </p>
        ))}
      </Section>

      <Section title="Sugerencia de evaluacion">{c.sugerencia_evaluacion}</Section>

      <p className="text-xs mt-4 border-t border-forest-800/30 pt-2">
        Prototipo AULA RAIZ. El docente debe revisar esta sesion antes de aplicarla.
      </p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-4">
      <h2 className="text-sm font-bold uppercase tracking-wide text-forest-800 mb-1">{title}</h2>
      <div className="text-sm">{children}</div>
    </section>
  );
}
