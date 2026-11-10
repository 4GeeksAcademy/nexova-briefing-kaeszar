import { Suspense } from "react";
import CandidatesList from "./candidates-list";
import type { Candidate } from "@/types/candidate";

type CandidatesListBoundaryProps = {
  candidates: Candidate[];
  total: number;
};

function FiltersLoading() {
  return (
    <section aria-labelledby="candidates-heading" className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 id="candidates-heading" className="font-semibold">Candidaturas</h2>
      </div>
      <p role="status" className="px-5 py-12 text-center text-slate-600">Preparando búsqueda y filtros…</p>
    </section>
  );
}

export default function CandidatesListBoundary({ candidates, total }: CandidatesListBoundaryProps) {
  return (
    <Suspense fallback={<FiltersLoading />}>
      <CandidatesList candidates={candidates} total={total} />
    </Suspense>
  );
}
