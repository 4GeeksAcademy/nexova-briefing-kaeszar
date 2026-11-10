"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Candidate } from "@/types/candidate";

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

type CandidatesListProps = {
  candidates: Candidate[];
  total: number;
};

export default function CandidatesList({ candidates, total }: CandidatesListProps) {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const statusFilter = searchParams.get("status") ?? "";
  const stageFilter = searchParams.get("stage") ?? "";

  const filteredCandidates = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase();

    return candidates.filter((candidate) => {
      const matchesStatus = !statusFilter || candidate.status === statusFilter;
      const matchesStage = !stageFilter || candidate.stage === stageFilter;
      const matchesSearch =
        !normalizedSearch ||
        candidate.full_name.toLocaleLowerCase().includes(normalizedSearch) ||
        candidate.email.toLocaleLowerCase().includes(normalizedSearch);

      return matchesStatus && matchesStage && matchesSearch;
    });
  }, [candidates, search, stageFilter, statusFilter]);

  function updateQueryParam(key: "search" | "status" | "stage", value: string, replace = false) {
    const params = new URLSearchParams(window.location.search);

    if (value) params.set(key, value);
    else params.delete(key);

    const query = params.toString();
    const url = query ? `/?${query}` : "/";

    if (replace) window.history.replaceState(null, "", url);
    else window.history.pushState(null, "", url);
  }

  return (
    <section aria-labelledby="candidates-heading" className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 id="candidates-heading" className="font-semibold">Candidaturas</h2>
          <p className="mt-1 text-sm text-slate-500">{filteredCandidates.length} de {total} candidaturas</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:flex">
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            <span>Buscar por nombre o email</span>
            <input type="search" value={search} onChange={(event) => updateQueryParam("search", event.target.value, true)} placeholder="Ej. Ana o ana@empresa.com" className="min-h-10 rounded-lg border border-slate-300 px-3 font-normal outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20" />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            <span>Estado</span>
            <select value={statusFilter} onChange={(event) => updateQueryParam("status", event.target.value)} className="min-h-10 rounded-lg border border-slate-300 bg-white px-3 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20">
              <option value="">Todos los estados</option>
              {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            <span>Etapa</span>
            <select value={stageFilter} onChange={(event) => updateQueryParam("stage", event.target.value)} className="min-h-10 rounded-lg border border-slate-300 bg-white px-3 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20">
              <option value="">Todas las etapas</option>
              {Object.entries(stageLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
        </div>
      </div>

      {filteredCandidates.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <p className="font-medium text-slate-800">
            {candidates.length === 0 ? "Todavía no hay candidaturas registradas." : "No hay candidaturas que coincidan con estos criterios."}
          </p>
          {candidates.length > 0 && (search || statusFilter || stageFilter) && (
            <button type="button" onClick={() => window.history.pushState(null, "", "/")} className="mt-3 font-semibold text-teal-800 underline-offset-4 hover:underline">
              Limpiar búsqueda y filtros
            </button>
          )}
        </div>
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
              {filteredCandidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-900">{candidate.full_name}</p>
                    <p className="mt-1 text-slate-500">{candidate.email}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-700">{candidate.position}</td>
                  <td className="px-5 py-4"><span className="inline-flex rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-800">{labelFor(candidate.status, statusLabels)}</span></td>
                  <td className="px-5 py-4 text-slate-700">{labelFor(candidate.stage, stageLabels)}</td>
                  <td className="px-5 py-4 text-right">
                    <Link href={`/candidates/${encodeURIComponent(candidate.id)}${searchParams.size ? `?${searchParams.toString()}` : ""}`} className="font-semibold text-teal-800 underline-offset-4 hover:underline focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
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
  );
}
