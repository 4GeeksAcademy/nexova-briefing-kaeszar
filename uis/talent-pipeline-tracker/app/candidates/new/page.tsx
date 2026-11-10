import Link from "next/link";
import CandidateForm from "@/app/candidate-form";

export default function NewCandidatePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="inline-flex rounded font-semibold text-teal-800 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700">
          ← Volver al listado
        </Link>
        <header className="mt-8 mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Operaciones de Selección</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Nueva candidatura</h1>
          <p className="mt-2 text-slate-600">Completa los datos de la persona candidata para registrarla en el pipeline.</p>
        </header>
        <section aria-labelledby="new-candidate-heading" className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 id="new-candidate-heading" className="sr-only">Datos de la nueva candidatura</h2>
          <CandidateForm />
        </section>
      </div>
    </main>
  );
}
