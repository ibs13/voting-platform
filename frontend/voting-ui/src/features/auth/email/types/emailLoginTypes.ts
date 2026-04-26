export type ActiveElectionResponse = {
  id: string;
  name: string;
  status: string;
  startAt: string;
  endAt: string;
};

export type RequestOtpRequest = {
  email: string;
};

export type RequestOtpResponse = {
  message?: string;
};
