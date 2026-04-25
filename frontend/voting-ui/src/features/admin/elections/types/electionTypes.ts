export type Election = {
  id: string;
  name: string;
  status: string;
  startAt: string;
  endAt: string;
};

export type CreateElectionRequest = {
  name: string;
  startAt: string;
  endAt: string;
};
