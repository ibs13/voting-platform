export type Voter = {
  id: string;
  name: string;
  email: string;
  session: string;
  department: string;
  isEligible: boolean;
};

export type CreateVoterRequest = {
  name: string;
  email: string;
  session: string;
  department: string;
};

export type UploadVotersCsvResponse = {
  message: string;
  imported: number;
  skipped: number;
};

export type DeleteVoterResponse = {
  message?: string;
};
