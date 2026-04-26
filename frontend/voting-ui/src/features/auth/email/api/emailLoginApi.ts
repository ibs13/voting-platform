import { api } from "@/shared/api/axios";
import type {
  ActiveElectionResponse,
  RequestOtpRequest,
  RequestOtpResponse,
} from "@/features/auth/email/types/emailLoginTypes";

export const emailLoginApi = {
  getActiveElection: async () => {
    const response = await api.get<ActiveElectionResponse>("/elections/active");

    return response.data;
  },

  requestOtp: async (data: RequestOtpRequest) => {
    const response = await api.post<RequestOtpResponse>(
      "/auth/request-otp",
      data,
    );

    return response.data;
  },
};
