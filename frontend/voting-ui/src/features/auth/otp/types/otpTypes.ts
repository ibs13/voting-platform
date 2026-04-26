export type VerifyOtpRequest = {
  electionId: string;
  email: string;
  otp: string;
};

export type VerifyOtpResponse = {
  token: string;
};
