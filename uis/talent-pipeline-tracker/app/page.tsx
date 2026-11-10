import Link from "next/link";
import { getCandidates } from "@/lib/api";

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

export default async function HomePage() {
  let candidates;
  let errorMessage: string | null = null;

  try {
    candidates = await getCandidates();
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "No se pudieron cargar las candidaturas.";
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
            People · Talent acquisition
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Pipeline de candidaturas
          </h1>
          <p className="mt-2 text-slate-600">
            Consulta las candidaturas y su estado actual en el proceso de selección.
          </p>
        </header>

        {errorMessage ? (
          <section role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-900">
            <h2 className="font-semibold">No se pudieron cargar las candidaturas</h2>
            <p className="mt-1 text-sm">{errorMessage}</p>
            <p className="mt-3 text-sm">Actualiza la página para volver a intentarlo.</p>
          </section>
        ) : candidates ? (
          <section aria-labelledby="candidates-heading" className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 id="candidates-heading" className="font-semibold">Candidaturas</h2>
              <span className="text-sm text-slate-500">{candidates.total} en total</span>
            </div>

            {candidates.data.length === 0 ? (
              <p className="px-5 py-12 text-center text-slate-600">Todavía no hay candidaturas registradas.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th scope="col" className="px-5 py-3 font-semibold">Candidatura</th>
                      <th scope="col" className="px-5 py-3 font-semibold">Puesto</th>
                      <th scope="col" className="px-5 py-3 font-semibold">Estado</th>
                      <th scope="col" className="px-5 py-3 font-semibold">Etapa</th>
                      <th scope="col" className="px-5 py-3 font-semibold"><span className="sr-only">Acción</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {candidates.data.map((candidate) => (
                      <tr key={candidate.id} className="hover:bg-slate-50">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-900">{candidate.full_name}</p>
                          <p className="mt-1 text-slate-500">{candidate.email}</p>
                        </td>
                        <td className="px-5 py-4 text-slate-700">{candidate.position}</td>
                        <td className="px-5 py-4">
                          <span className="inline-flex rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-800">
                            {labelFor(candidate.status, statusLabels)}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-700">{labelFor(candidate.stage, stageLabels)}</td>
                        <td className="px-5 py-4 text-right">
                          <Link
                            href={`/candidates/${encodeURIComponent(candidate.id)}`}
                            className="font-semibold text-teal-800 underline-offset-4 hover:underline focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                          >
                            Ver detalle<span className="sr-only"> de {candidate.full_name}</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ) : (
          <p role="status" className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
            Cargando candidaturas…
          </p>
        )}
      </div>
    </main>
  );
}
