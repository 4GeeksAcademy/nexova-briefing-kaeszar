"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Candidate, CandidateNote } from "@/lib/api";
import { addCandidateNote, deleteCandidateNote, updateCandidate } from "@/lib/api";

const statusOptions = [
  ["received", "Recibida"],
  ["in_progress", "En proceso"],
  ["selected", "Seleccionada"],
  ["discarded", "Descartada"],
] as const;

const stageOptions = [
  ["pending", "Pendiente"],
  ["review", "Revisión"],
  ["personal_interview", "Entrevista personal"],
  ["technical_interview", "Entrevista técnica"],
  ["offer_presented", "Oferta presentada"],
] as const;

type CandidateManagementProps = {
  candidate: Candidate;
  initialNotes: CandidateNote[];
  notesError: string | null;
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export default function CandidateManagement({ candidate: initialCandidate, initialNotes, notesError }: CandidateManagementProps) {
  const router = useRouter();
  const [candidate, setCandidate] = useState(initialCandidate);
  const [notes, setNotes] = useState(initialNotes);
  const [noteContent, setNoteContent] = useState("");
  const [savingField, setSavingField] = useState<"status" | "stage" | null>(null);
  const [savingNote, setSavingNote] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [notesLoadError, setNotesLoadError] = useState(notesError);

  async function saveCandidateField(field: "status" | "stage", value: string) {
    const previousValue = candidate[field];
    setCandidate((current) => ({ ...current, [field]: value }));
    setSavingField(field);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const updatedCandidate = await updateCandidate(candidate.id, { [field]: value });
      setCandidate(updatedCandidate);
      setSuccessMessage(field === "status" ? "Estado actualizado." : "Etapa actualizada.");
      router.refresh();
    } catch (error) {
      setCandidate((current) => ({ ...current, [field]: previousValue }));
      setErrorMessage(error instanceof Error ? error.message : "No se pudo actualizar la candidatura.");
    } finally {
      setSavingField(null);
    }
  }

  async function submitNote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = noteContent.trim();
    if (!content) return;

    setSavingNote(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const newNote = await addCandidateNote(candidate.id, content);
      setNotes((current) => [...current, newNote]);
      setCandidate((current) => ({ ...current, notes_count: current.notes_count + 1 }));
      setNoteContent("");
      setNotesLoadError(null);
      setSuccessMessage("Nota añadida.");
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudo añadir la nota.");
    } finally {
      setSavingNote(false);
    }
  }

  async function removeNote(noteId: string) {
    setDeletingNoteId(noteId);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await deleteCandidateNote(candidate.id, noteId);
      setNotes((current) => current.filter((note) => note.id !== noteId));
      setCandidate((current) => ({ ...current, notes_count: Math.max(0, current.notes_count - 1) }));
      setSuccessMessage("Nota eliminada.");
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudo eliminar la nota.");
    } finally {
      setDeletingNoteId(null);
    }
  }

  return (
    <>
      <section aria-labelledby="pipeline-heading" className="mt-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 id="pipeline-heading" className="text-lg font-semibold">Seguimiento de la candidatura</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            <span>Estado</span>
            <select
              value={candidate.status}
              disabled={savingField !== null}
              onChange={(event) => void saveCandidateField("status", event.target.value)}
              className="min-h-11 rounded-lg border border-slate-300 bg-white px-3 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 disabled:opacity-60"
            >
              {statusOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            <span>Etapa</span>
            <select
              value={candidate.stage}
              disabled={savingField !== null}
              onChange={(event) => void saveCandidateField("stage", event.target.value)}
              className="min-h-11 rounded-lg border border-slate-300 bg-white px-3 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 disabled:opacity-60"
            >
              {stageOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
        </div>
        {savingField && <p role="status" className="mt-3 text-sm text-slate-600">Guardando cambios…</p>}
      </section>

      <section aria-labelledby="notes-heading" className="mt-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="notes-heading" className="text-lg font-semibold">Notas internas</h2>
          <p className="text-sm text-slate-500">{notes.length} {notes.length === 1 ? "nota" : "notas"}</p>
        </div>

        {notesLoadError ? (
          <p role="alert" className="mt-4 rounded-lg bg-rose-50 p-4 text-sm text-rose-900">{notesLoadError}</p>
        ) : notes.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600">Todavía no hay notas para esta candidatura.</p>
        ) : (
          <ul className="mt-5 divide-y divide-slate-100">
            {notes.map((note) => (
              <li key={note.id} className="flex flex-col gap-3 py-4 first:pt-0 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="whitespace-pre-wrap break-words text-sm text-slate-800">{note.content}</p>
                  <time dateTime={note.created_at} className="mt-2 block text-xs text-slate-500">{formatDate(note.created_at)}</time>
                </div>
                <button
                  type="button"
                  disabled={deletingNoteId !== null}
                  onClick={() => void removeNote(note.id)}
                  className="self-start rounded font-medium text-rose-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700 disabled:opacity-50"
                >
                  {deletingNoteId === note.id ? "Eliminando…" : "Eliminar nota"}
                  <span className="sr-only"> del {formatDate(note.created_at)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={submitNote} className="mt-6 border-t border-slate-200 pt-5">
          <label htmlFor="new-note" className="block text-sm font-medium text-slate-700">Añadir una nota</label>
          <textarea
            id="new-note"
            value={noteContent}
            onChange={(event) => setNoteContent(event.target.value)}
            rows={4}
            required
            maxLength={5000}
            placeholder="Escribe una nota interna sobre esta candidatura…"
            className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-500">Las notas son internas para el equipo de selección.</p>
            <button
              type="submit"
              disabled={savingNote || !noteContent.trim()}
              className="rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {savingNote ? "Añadiendo…" : "Añadir nota"}
            </button>
          </div>
        </form>
      </section>

      {(errorMessage || successMessage) && (
        <p role={errorMessage ? "alert" : "status"} className={`mt-4 rounded-lg p-4 text-sm ${errorMessage ? "bg-rose-50 text-rose-900" : "bg-teal-50 text-teal-900"}`}>
          {errorMessage ?? successMessage}
        </p>
      )}
    </>
  );
}
