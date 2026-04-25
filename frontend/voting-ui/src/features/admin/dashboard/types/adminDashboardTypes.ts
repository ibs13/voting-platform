export type DashboardElection = {
  id: string;
  name: string;
  status: string;
  startAt: string;
  endAt: string;
};

export type TurnoutResponse = {
  eligible: number;
  voted: number;
};

export type ElectionActionResponse = {
  message?: string;
};
