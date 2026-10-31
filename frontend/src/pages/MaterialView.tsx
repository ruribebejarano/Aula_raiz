import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { BookOpenText, RefreshCw } from "lucide-react";
import { generateLesson, generateMaterial, listLessons, listMaterials } from "../api/endpoints";
import type { LessonPlan, Material } from "../api/types";
import { Button, ErrorState, GradeBadge, LoadingState, SupportBadge } from "../components/Common";
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
          partes={content.texto_partes?.length ? content.texto_partes : [content.texto_o_situacion]}
          preguntaInteractiva={content.pregunta_interactiva}
          respuestaClave={content.respuesta_clave}
          onClose={() => setStoryModeOpen(false)}
        />
      )}
    </div>
  );
}

const PROVIDER_LABELS: Record<string, string> = {
  demo: "Contenido de demostracion — plantilla local.",
  ollama: "Generado por Ollama (modelo local).",
  claude: "Generado por Claude (Anthropic).",
};

function ProviderNotice({ provider, aviso }: { provider: string; aviso: string }) {
  return (
    <p className="text-xs italic text-forest-700/70 mb-4 no-print">
      {PROVIDER_LABELS[provider] ?? "Contenido generado."} {aviso}
    </p>
  );
}

function InteractiveNote({ pregunta }: { pregunta: string }) {
  if (!pregunta) return null;
  return (
    <div className="mb-5 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 text-sm print:border-black">
      <p className="text-[11px] font-bold uppercase tracking-wide text-amber-700 mb-0.5">
        Pausa interactiva — pregunta antes de seguir
      </p>
      <p className="text-amber-900">{pregunta}</p>
    </div>
  );
}

function AnswerKeyNote({ respuesta }: { respuesta: string | null }) {
  if (!respuesta) return null;
  return (
    <p className="no-print text-xs text-forest-700/70 mb-5 bg-forest-50 border border-forest-100 rounded px-3 py-2">
      <strong>Clave para el docente (no imprimir con los estudiantes):</strong> {respuesta}
    </p>
  );
}

/** Texto del cuento/situacion como parrafos numerados, en vez de un bloque de texto plano. */
function StoryText({ parts, area }: { parts: string[]; area: string }) {
  const isComunicacion = area?.toLowerCase().startsWith("com");
  if (parts.length <= 1) {
    return (
      <p className="italic border-l-2 border-forest-800/30 pl-3 whitespace-pre-line">{parts[0]}</p>
    );
  }
  return (
    <div className="space-y-3">
      {parts.map((p, i) => (
        <div key={i} className="flex gap-3">
          <span className="shrink-0 w-6 h-6 rounded-full bg-forest-100 text-forest-700 text-[11px] font-bold flex items-center justify-center mt-0.5 print:border print:border-black print:bg-white">
            {i + 1}
          </span>
          <p className="italic leading-relaxed">{p}</p>
        </div>
      ))}
      {isComunicacion && (
        <p className="text-[11px] text-forest-700/50 no-print">
          Sugerencia: usa Modo interactivo para presentar esto parte por parte, con pausa incluida.
        </p>
      )}
    </div>
  );
}

/** Una tarea distinta por cada grado presente: misma situacion, exigencia diferente. */
function GradeTasksSection({
  tasks,
}: {
  tasks: { grado: number; instruccion: string; pregunta: string }[];
}) {
  if (!tasks || tasks.length === 0) return null;
  return (
    <section className="mb-5">
      <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-forest-800 mb-2">
        Actividades por grado
      </h2>
      <p className="text-xs text-forest-700/60 mb-3 no-print">
        Todos trabajan la misma historia/situacion; la exigencia cambia segun el grado.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        {tasks.map((t) => (
          <div
            key={t.grado}
            className="border border-forest-100 rounded-lg p-3 flex gap-3 print:border-black"
          >
            <GradeBadge grade={t.grado} className="print:bg-white print:text-black print:border-black" />
            <div className="text-sm">
              <p className="mb-1">{t.instruccion}</p>
              <p className="text-forest-700/70 italic">{t.pregunta}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function GroupActivitiesSection({
  activities,
}: {
  activities: { grupo: string; actividad: string }[];
}) {
  if (!activities || activities.length === 0) return null;
  return (
    <section className="mb-5">
      <h2 className="text-sm font-bold uppercase tracking-wide text-forest-800 mb-2">
        Actividades por nivel de apoyo
      </h2>
      <div className="space-y-2">
        {activities.map((ga, i) => (
          <div key={i} className="flex items-start gap-2 text-sm">
            <SupportBadge level={ga.grupo} />
            <p className="flex-1">{ga.actividad}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PrintableMaterial({ material }: { material: Material }) {
  const c = material.content;
  return (
    <div className="print-page bg-white rounded-xl border border-forest-100 shadow-sm p-6 md:p-10 max-w-3xl mx-auto print:border-0 print:shadow-none print:max-w-full">
      <ProviderNotice provider={material.provider} aviso={c.aviso} />
      <header className="mb-5 border-b border-forest-800 pb-3">
        <h1 className="text-xl font-bold">{c.titulo}</h1>
        <p className="text-sm">
          Area: {c.area} · Tema: {c.tema} · Grado/grupo: {c.grado_grupo}
        </p>
        <p className="text-xs mt-2">Nombre o codigo: _______________________ Fecha: ____ / ____ / ______</p>
      </header>

      <Section title="Proposito">{c.proposito}</Section>

      <Section title={c.area?.toLowerCase().startsWith("com") ? "Texto de lectura" : "Situacion"}>
        <StoryText parts={c.texto_partes?.length ? c.texto_partes : [c.texto_o_situacion]} area={c.area} />
      </Section>

      <InteractiveNote pregunta={c.pregunta_interactiva} />
      <AnswerKeyNote respuesta={c.respuesta_clave} />

      <GradeTasksSection tasks={c.actividades_por_grado} />
      <GroupActivitiesSection activities={c.actividades_por_grupo} />

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

      <Section title="Preguntas / Ejercicios adicionales">
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
      <ProviderNotice provider={lesson.provider} aviso={c.aviso} />
      <header className="mb-5 border-b border-forest-800 pb-3">
        <h1 className="text-xl font-bold">{c.titulo}</h1>
        <p className="text-sm">
          Area: {c.area} · Tema: {c.tema} · Grado/grupo: {c.grado_grupo} · Duracion:{" "}
          {c.duracion_minutos} min
        </p>
      </header>

      <Section title="Proposito">{c.proposito}</Section>

      <Section title={c.area?.toLowerCase().startsWith("com") ? "Texto de lectura" : "Situacion"}>
        <StoryText parts={c.texto_partes?.length ? c.texto_partes : [c.texto_o_situacion]} area={c.area} />
      </Section>

      <InteractiveNote pregunta={c.pregunta_interactiva} />
      <AnswerKeyNote respuesta={c.respuesta_clave} />

      <GradeTasksSection tasks={c.actividades_por_grado} />

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

      <GroupActivitiesSection activities={c.actividades_por_grupo} />

      <Section title="Sugerencia de evaluacion">{c.sugerencia_evaluacion}</Section>

      <p className="text-xs mt-4 border-t border-forest-800/30 pt-2">
        Prototipo AULA RAIZ. El docente debe revisar esta sesion antes de aplicarla.
      </p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-5">
      <h2 className="text-sm font-bold uppercase tracking-wide text-forest-800 mb-1.5">{title}</h2>
      <div className="text-sm">{children}</div>
    </section>
  );
}
