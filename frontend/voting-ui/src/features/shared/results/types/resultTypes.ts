export type CandidateResult = {
  candidateId: string;
  fullName: string;
  voteCount: number;
};

export type OfficeResult = {
  office: string;
  results: CandidateResult[];
  winnerCandidateIds: string[];
  isTie: boolean;
};

export type ResultsResponse = {
  electionId: string;
  electionName: string;
  totalEligibleVoters: number;
  totalVotesCast: number;
  offices: OfficeResult[];
};
