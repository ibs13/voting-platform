import { api } from "@/shared/api/axios";
import type {
  VerifyOtpRequest,
  VerifyOtpResponse,
} from "@/features/auth/otp/types/otpTypes";

export const otpApi = {
  verifyOtp: async (data: VerifyOtpRequest) => {
    const response = await api.post<VerifyOtpResponse>(
      "/auth/verify-otp",
      data,
    );

    return response.data;
  },
};
