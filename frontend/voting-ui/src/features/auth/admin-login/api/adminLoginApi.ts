import { api } from "@/shared/api/axios";
import type {
  AdminLoginRequest,
  AdminLoginResponse,
} from "@/features/auth/admin-login/types/adminLoginTypes";

export const adminLoginApi = {
  login: async (data: AdminLoginRequest) => {
    const response = await api.post<AdminLoginResponse>(
      "/admin/auth/login",
      data,
    );

    return response.data;
  },
};
