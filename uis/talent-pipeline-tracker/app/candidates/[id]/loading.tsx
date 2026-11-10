export default function CandidateLoading() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <p role="status" aria-live="polite" className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
          Cargando detalle de la candidatura…
        </p>
      </div>
    </main>
  );
}
