export type Candidate = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  position: string;
  linkedin_url: string | null;
  cv_url: string | null;
  status: string;
  stage: string;
  experience_years: number;
  notes_count: number;
  applied_at: string;
  updated_at: string;
};

type CandidateListResponse = {
  total: number;
  page: number;
  limit: number;
  data: Candidate[];
};

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "https://playground.4geeks.com/tracker/api/v1"
).replace(/\/$/, "");

async function fetchApi<T>(path: string): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, { cache: "no-store" });
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
