export type CandidateOffice = "President" | "Secretary" | "Treasurer";

export type Candidate = {
  id: string;
  fullName: string;
  session: string | null;
  department: string | null;
  office: CandidateOffice;
};

export type CreateCandidateRequest = {
  fullName: string;
  session: string | null;
  department: string | null;
  office: CandidateOffice;
};

export type UploadCandidatesCsvResponse = {
  message: string;
  imported: number;
  skipped: number;
};

export type DeleteCandidateResponse = {
  message?: string;
};
