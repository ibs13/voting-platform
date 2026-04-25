import { api } from "@/shared/api/axios";
import type {
  CreateElectionRequest,
  Election,
} from "@/features/admin/elections/types/electionTypes";

export const electionApi = {
  getAll: async () => {
    const response = await api.get<Election[]>("/admin/elections");
    return response.data;
  },

  create: async (data: CreateElectionRequest) => {
    const response = await api.post<Election>("/admin/elections", data);
    return response.data;
  },

  delete: async (electionId: string) => {
    const response = await api.delete(`/admin/elections/${electionId}`);
    return response.data;
  },
};
