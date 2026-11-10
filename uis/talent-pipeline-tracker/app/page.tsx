import CandidatesListBoundary from "./candidates-list-boundary";
import { getCandidates } from "@/lib/api";

export default async function HomePage() {
  let candidates;
  let total = 0;
  let errorMessage: string | null = null;

  try {
    const result = await getCandidates();
    candidates = result.data;
    total = result.total;
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
          <CandidatesListBoundary candidates={candidates} total={total} />
        ) : null}
      </div>
    </main>
  );
}
