"use client";

import { ChangeEvent, DragEvent, useState } from "react";

type IncidentAnalysis = {
  total_rows: number;
  valid_rows: number;
  invalid_rows: number;
  invalid_reasons: Record<string, number>;
  invalid_records: Array<{ row_number: number; reasons: string[] }>;
  categories: Record<string, number>;
  statuses: Record<string, number>;
  closed_scored_count: number;
  average_closed_satisfaction: number | null;
};

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

const ISSUE_LABELS: Record<string, string> = {
  "missing_required_field:ticket_id": "Falta el identificador del ticket.",
  "missing_required_field:date": "Falta la fecha.",
  "missing_required_field:client_company": "Falta la empresa cliente.",
  "missing_required_field:category": "Falta la categoría.",
  "missing_required_field:description": "Falta la descripción.",
  "missing_required_field:agent_id": "Falta el identificador del agente.",
  "missing_required_field:status": "Falta el estado.",
  "missing_required_field:customer_email": "Falta el correo del cliente.",
  "value_out_of_range:category": "La categoría no está entre los valores admitidos por el CSV.",
  "value_out_of_range:status": "El estado no está entre los valores admitidos por el CSV.",
  "invalid_format:date": "La fecha no tiene un formato válido.",
  "value_out_of_range:satisfaction_score": "La puntuación está fuera del rango permitido por la validación actual (1–5).",
  "invalid_format:satisfaction_score": "La puntuación no es numérica.",
  "invalid_record_structure:extra_columns": "La fila contiene más columnas que el encabezado.",
};

function friendlyIssue(reason: string) {
  return ISSUE_LABELS[reason] ?? "El registro no cumple la validación del CSV.";
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <article className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-primary-800">{value}</p>
    </article>
  );
}

export default function IncidentsPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<IncidentAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  function selectFile(file?: File) {
    setError(null);
    setAnalysis(null);
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setSelectedFile(null);
      setError("Selecciona un archivo con extensión .csv.");
      return;
    }
    setSelectedFile(file);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    selectFile(event.target.files?.[0]);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    selectFile(event.dataTransfer.files?.[0]);
  }

  async function analyzeFile() {
    if (!selectedFile) return;
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const response = await fetch(`${API_BASE_URL}/api/incidents/analyze`, {
        method: "POST",
        body: formData,
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        const detail = typeof payload?.detail === "string" ? payload.detail : `No se pudo analizar el CSV (HTTP ${response.status}).`;
        throw new Error(detail);
      }
      if (!payload) throw new Error("La API respondió con un formato inesperado. Comprueba que la URL apunte al backend FastAPI.");
      setAnalysis(payload as IncidentAnalysis);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo conectar con el servicio de análisis.");
    } finally {
      setIsLoading(false);
    }
  }

  async function downloadResults() {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/incidents/results/export`);
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.detail ?? "No se pudo descargar el resumen.");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "results.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo descargar el resumen.");
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-accent-700">Atención al cliente</p>
        <h1 className="mt-2 text-3xl font-bold text-primary-900">Analizador de incidencias</h1>
        <p className="mt-2 max-w-3xl text-neutral-600">
          Carga un CSV para validar sus registros y obtener métricas agregadas. El archivo se procesa en memoria;
          no se muestran ni se exportan datos personales de las incidencias.
        </p>
      </header>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm" aria-labelledby="upload-title">
        <h2 id="upload-title" className="text-lg font-semibold text-primary-900">Archivo de origen</h2>
        <label
          onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`mt-4 flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 text-center transition ${isDragging ? "border-accent-500 bg-accent-50" : "border-neutral-300 hover:border-primary-400"}`}
        >
          <span className="font-medium text-neutral-800">Arrastra aquí el CSV o selecciónalo</span>
          <span className="mt-1 text-sm text-neutral-500">Formato CSV UTF-8, máximo 10 MB</span>
          <input type="file" accept=".csv,text/csv" className="sr-only" onChange={handleFileChange} />
        </label>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <p className="min-w-0 flex-1 truncate text-sm text-neutral-600" aria-live="polite">
            {selectedFile ? `Archivo seleccionado: ${selectedFile.name}` : "Ningún archivo seleccionado"}
          </p>
          <button
            type="button"
            onClick={analyzeFile}
            disabled={!selectedFile || isLoading}
            className="rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Analizando…" : "Analizar CSV"}
          </button>
        </div>
        {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
      </section>

      {analysis && (
        <section className="space-y-6" aria-live="polite">
          <div className="grid gap-4 sm:grid-cols-3">
            <MetricCard label="Registros procesados" value={analysis.total_rows} />
            <MetricCard label="Registros válidos" value={analysis.valid_rows} />
            <MetricCard label="Registros inválidos" value={analysis.invalid_rows} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-primary-900">Incidencias por categoría</h2>
              <SummaryList values={analysis.categories} emptyLabel="No hay categorías para mostrar." />
            </article>
            <article className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-primary-900">Incidencias por estado</h2>
              <SummaryList values={analysis.statuses} emptyLabel="No hay estados para mostrar." />
            </article>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-primary-900">Validación</h2>
              {analysis.invalid_records.length ? (
                <ul className="mt-4 space-y-3">
                  {analysis.invalid_records.map((record) => (
                    <li key={record.row_number} className="rounded-lg bg-amber-50 p-3 text-sm text-amber-950">
                      <p className="font-semibold">Fila {record.row_number}</p>
                      <ul className="mt-1 list-inside list-disc">
                        {record.reasons.map((reason) => <li key={reason}>{friendlyIssue(reason)}</li>)}
                      </ul>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-neutral-500">No se encontraron registros inválidos.</p>
              )}
            </article>
            <article className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-primary-900">Satisfacción en casos cerrados</h2>
              <p className="mt-5 text-3xl font-semibold text-primary-800">
                {analysis.average_closed_satisfaction === null ? "N/D" : `${analysis.average_closed_satisfaction.toFixed(2)} / 5`}
              </p>
              <p className="mt-2 text-sm text-neutral-500">
                {analysis.closed_scored_count} casos CLOSED con puntuación
              </p>
            </article>
          </div>

          <div className="flex justify-end">
            <button type="button" onClick={downloadResults} className="rounded-lg border border-primary-700 px-5 py-2.5 text-sm font-semibold text-primary-800 hover:bg-primary-50">
              Descargar resultados CSV
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

function SummaryList({ values, emptyLabel }: { values: Record<string, number>; emptyLabel: string }) {
  const entries = Object.entries(values);
  if (entries.length === 0) return <p className="mt-4 text-sm text-neutral-500">{emptyLabel}</p>;
  return (
    <ul className="mt-4 divide-y divide-neutral-100">
      {entries.map(([label, value]) => (
        <li key={label} className="flex justify-between gap-4 py-2.5 text-sm">
          <span className="break-all text-neutral-600">{label}</span>
          <span className="font-semibold text-neutral-900">{value}</span>
        </li>
      ))}
    </ul>
  );
}
