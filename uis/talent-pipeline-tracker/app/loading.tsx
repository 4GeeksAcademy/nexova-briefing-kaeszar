export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <p role="status" aria-live="polite" className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
          Cargando candidaturas…
        </p>
      </div>
    </main>
  );
}
