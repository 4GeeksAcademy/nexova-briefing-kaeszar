import type {
  Candidate,
  CandidateCreate,
  CandidateCreateResponse,
  CandidateListResponse,
  CandidateNoteCreate,
  CandidateNoteCreateResponse,
  CandidateNoteDeleteResponse,
  CandidateNotesResponse,
  CandidateUpdate,
  CandidateUpdateResponse,
} from "@/types/candidate";

export type {
  Candidate,
  CandidateCreate as CandidateFormData,
  CandidateCreateResponse,
  CandidateListResponse,
  CandidateNote,
  CandidateNoteCreateResponse,
  CandidateNoteDeleteResponse,
  CandidateNotesResponse,
  CandidateUpdate,
  CandidateUpdateResponse,
} from "@/types/candidate";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "https://playground.4geeks.com/tracker/api/v1"
).replace(/\/$/, "");

async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, { cache: "no-store", ...init });
  } catch {
    throw new Error("No se pudo conectar con la API. Comprueba tu conexión e inténtalo de nuevo.");
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("No se encontró la candidatura solicitada.");
    }

    throw new Error(`La API respondió con un error (${response.status}). Inténtalo de nuevo más tarde.`);
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new Error("La API devolvió una respuesta no válida. Inténtalo de nuevo más tarde.");
  }
}

export async function getCandidates(): Promise<CandidateListResponse> {
  const limit = 100;
  const firstPage = await fetchApi<CandidateListResponse>(`/records?page=1&limit=${limit}`);
  const pageCount = Math.ceil(firstPage.total / limit);

  if (pageCount <= 1) return firstPage;

  const remainingPages = await Promise.all(
    Array.from({ length: pageCount - 1 }, (_, index) =>
      fetchApi<CandidateListResponse>(`/records?page=${index + 2}&limit=${limit}`),
    ),
  );

  return {
    ...firstPage,
    data: [firstPage, ...remainingPages].flatMap((page) => page.data),
  };
}

export async function getCandidate(id: string): Promise<Candidate> {
  return fetchApi<Candidate>(`/records/${encodeURIComponent(id)}`);
}

export async function createCandidate(candidate: CandidateCreate): Promise<CandidateCreateResponse> {
  return fetchApi<CandidateCreateResponse>("/records", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(candidate),
  });
}

export async function replaceCandidate(id: string, candidate: CandidateCreate): Promise<CandidateUpdateResponse> {
  return fetchApi<CandidateUpdateResponse>(`/records/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(candidate),
  });
}

export async function updateCandidate(id: string, updates: CandidateUpdate): Promise<CandidateUpdateResponse> {
  return fetchApi<CandidateUpdateResponse>(`/records/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
}

export async function getCandidateNotes(id: string): Promise<CandidateNotesResponse> {
  return fetchApi<CandidateNotesResponse>(`/records/${encodeURIComponent(id)}/notes`);
}

export async function addCandidateNote(id: string, content: string): Promise<CandidateNoteCreateResponse> {
  const note: CandidateNoteCreate = { content };
  return fetchApi<CandidateNoteCreateResponse>(`/records/${encodeURIComponent(id)}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
}

export async function deleteCandidateNote(id: string, noteId: string): Promise<CandidateNoteDeleteResponse> {
  const path = `/records/${encodeURIComponent(id)}/notes/${encodeURIComponent(noteId)}`;
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, { method: "DELETE", cache: "no-store" });
  } catch {
    throw new Error("No se pudo conectar con la API. Comprueba tu conexión e inténtalo de nuevo.");
  }

  if (!response.ok) {
    throw new Error(`La API respondió con un error (${response.status}). Inténtalo de nuevo más tarde.`);
  }
}
