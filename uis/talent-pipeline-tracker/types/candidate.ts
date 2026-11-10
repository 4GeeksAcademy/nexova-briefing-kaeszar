export type CandidateStatus = string;

export type CandidateStage = string;

export type Candidate = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  position: string;
  linkedin_url: string | null;
  cv_url: string | null;
  status: CandidateStatus;
  stage: CandidateStage;
  experience_years: number;
  notes_count: number;
  applied_at: string;
  updated_at: string;
};

export type CandidateNote = {
  id: string;
  record_id: string;
  content: string;
  created_at: string;
};

export type CandidateNotesResponse = {
  data: CandidateNote[];
  meta: { total: number };
};

export type CandidateListResponse = {
  total: number;
  page: number;
  limit: number;
  data: Candidate[];
};

export type CandidateCreate = {
  full_name: string;
  email: string;
  phone: string;
  position: string;
  linkedin_url: string | null;
  cv_url: string | null;
  experience_years: number;
};

export type CandidateUpdate = Partial<Pick<Candidate, "status" | "stage">>;

export type CandidateUpdateResponse = Candidate;
export type CandidateCreateResponse = Candidate;
export type CandidateNoteCreateResponse = CandidateNote;

/** El endpoint DELETE devuelve HTTP 204 No Content y, por tanto, no tiene cuerpo JSON. */
export type CandidateNoteDeleteResponse = void;

export type CandidateNoteCreate = {
  content: string;
};