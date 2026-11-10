import Link from "next/link";
import { notFound } from "next/navigation";
import CandidateManagement from "./candidate-management";
import CandidateForm from "@/app/candidate-form";
import { getCandidate, getCandidateNotes } from "@/lib/api";
import type { CandidateNote } from "@/lib/api";

const statusLabels: Record<string, string> = {
  received: "Recibida",
  in_progress: "En proceso",
  selected: "Seleccionada",
  discarded: "Descartada",
};

const stageLabels: Record<string, string> = {
  pending: "Pendiente",
  review: "Revisión",
  personal_interview: "Entrevista personal",
  technical_interview: "Entrevista técnica",
  offer_presented: "Oferta presentada",
};

function labelFor(value: string, labels: Record<string, string>) {
  return labels[value] ?? value.replaceAll("_", " ");
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" }).format(date);
}

export default async function CandidateDetailPage({
  params,
  searchParams,
}: PageProps<"/candidates/[id]">) {
  const { id } = await params;
  const currentSearchParams = await searchParams;
  const returnParams = new URLSearchParams();
  for (const [key, value] of Object.entries(currentSearchParams)) {
    if (Array.isArray(value)) value.forEach((item) => returnParams.append(key, item));
    else if (value) returnParams.set(key, value);
  }
  const returnHref = returnParams.size ? `/?${returnParams.toString()}` : "/";
  let candidate;

  try {
    candidate = await getCandidate(id);
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo cargar la candidatura.";
    if (message.includes("No se encontró")) notFound();

    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <Link href={returnHref} className="font-semibold text-teal-800 hover:underline">
            ← Volver al listado
          </Link>
          <section role="alert" className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-900">
            <h1 className="font-semibold">No se pudo cargar la candidatura</h1>
            <p className="mt-1 text-sm">{message}</p>
            <p className="mt-3 text-sm">Vuelve a intentarlo más tarde.</p>
          </section>
        </div>
      </main>
    );
  }

  let initialNotes: CandidateNote[] = [];
  let notesError: string | null = null;
  try {
    const response = await getCandidateNotes(id);
    initialNotes = response.data;
  } catch (error) {
    notesError = error instanceof Error ? error.message : "No se pudieron cargar las notas.";
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <Link
          href={returnHref}
          className="inline-flex rounded font-semibold text-teal-800 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700"
        >
          ← Volver al listado
        </Link>

        <header className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Detalle de candidatura</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">{candidate.full_name}</h1>
          <p className="mt-2 text-lg text-slate-600">{candidate.position}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-900">
              {labelFor(candidate.status, statusLabels)}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
              {labelFor(candidate.stage, stageLabels)}
            </span>
          </div>
        </header>

        <section aria-labelledby="contact-heading" className="mt-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 id="contact-heading" className="text-lg font-semibold">Información de la candidatura</h2>
          <dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-slate-500">Nombre completo</dt>
              <dd className="mt-1 font-medium">{candidate.full_name}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Email</dt>
              <dd className="mt-1 break-words font-medium"><a className="text-teal-800 hover:underline" href={`mailto:${candidate.email}`}>{candidate.email}</a></dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Teléfono</dt>
              <dd className="mt-1 font-medium">{candidate.phone || "No indicado"}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Años de experiencia</dt>
              <dd className="mt-1 font-medium">{candidate.experience_years} {candidate.experience_years === 1 ? "año" : "años"}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Número de notas</dt>
              <dd className="mt-1 font-medium">{candidate.notes_count}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Fecha de candidatura</dt>
              <dd className="mt-1 font-medium">{formatDate(candidate.applied_at)}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Última actualización</dt>
              <dd className="mt-1 font-medium">{formatDate(candidate.updated_at)}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">LinkedIn</dt>
              <dd className="mt-1">{candidate.linkedin_url ? <a className="break-all font-medium text-teal-800 hover:underline" href={candidate.linkedin_url} target="_blank" rel="noreferrer">Ver perfil</a> : <span className="font-medium">No indicado</span>}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Enlace al CV</dt>
              <dd className="mt-1">{candidate.cv_url ? <a className="break-all font-medium text-teal-800 hover:underline" href={candidate.cv_url} target="_blank" rel="noreferrer">Ver currículum</a> : <span className="font-medium">No indicado</span>}</dd>
            </div>
          </dl>
        </section>

        <CandidateManagement candidate={candidate} initialNotes={initialNotes} notesError={notesError} />

        <section aria-labelledby="edit-candidate-heading" className="mt-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 id="edit-candidate-heading" className="mb-5 text-lg font-semibold">Editar datos de la candidatura</h2>
          <CandidateForm candidate={candidate} />
        </section>
      </div>
    </main>
  );
}
