export type BallotCandidate = {
  id: string;
  fullName: string;
  session: string | null;
  department: string | null;
  office: string;
};

export type BallotResponse = {
  electionId: string;
  electionName: string;
  candidates: BallotCandidate[];
};

export type VoteStatusResponse = {
  hasVoted: boolean;
};

export type CastVoteRequest = {
  electionId: string;
  votes: {
    office: string;
    candidateId: string;
  }[];
};

export type CastVoteResponse = {
  message?: string;
};

export type SelectedCandidates = {
  President: string;
  Secretary: string;
  Treasurer: string;
};

export type Office = keyof SelectedCandidates;

export type BallotStatus = "checking" | "loading" | "ready" | "error";
