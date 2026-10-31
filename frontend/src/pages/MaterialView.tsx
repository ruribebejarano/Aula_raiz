import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { listLessons, listMaterials } from "../api/endpoints";
import type { LessonPlan, Material } from "../api/types";
import { Button, ErrorState, LoadingState } from "../components/Common";
import RadioAulaButton from "../components/RadioAulaButton";

export default function MaterialView({ type }: { type: "material" | "lesson" }) {
  const { id } = useParams<{ id: string }>();
  const [material, setMaterial] = useState<Material | null>(null);
  const [lesson, setLesson] = useState<LessonPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

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
          ...material.content.instrucciones,
          ...material.content.preguntas.map((p) => p.enunciado),
        ].join(". ")
      : type === "lesson" && lesson
      ? [
          lesson.content.texto_o_situacion,
          lesson.content.proposito,
          ...lesson.content.momentos.map((m) => m.descripcion),
        ].join(". ")
      : "";

  return (
    <div>
      <div className="no-print flex items-center justify-between flex-wrap gap-3 mb-4">
        <Link to="/biblioteca" className="text-sm text-forest-600 underline">
          ← Volver a Biblioteca IA
        </Link>
        <div className="flex gap-2">
          <RadioAulaButton text={speechText} />
          <Button onClick={() => window.print()}>Imprimir / Guardar PDF</Button>
        </div>
      </div>

      {type === "material" && material && <PrintableMaterial material={material} />}
      {type === "lesson" && lesson && <PrintableLesson lesson={lesson} />}
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
        <p className="italic border-l-2 border-forest-800/30 pl-3">{c.texto_o_situacion}</p>
      </Section>

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
        <p className="italic border-l-2 border-forest-800/30 pl-3">{c.texto_o_situacion}</p>
      </Section>

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
