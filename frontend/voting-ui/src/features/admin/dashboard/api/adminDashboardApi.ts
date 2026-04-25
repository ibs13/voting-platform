import { api } from "@/shared/api/axios";
import type {
  DashboardElection,
  ElectionActionResponse,
  TurnoutResponse,
} from "../types/adminDashboardTypes";

export const adminDashboardApi = {
  getElections: async () => {
    const response = await api.get<DashboardElection[]>("/admin/elections");
    return response.data;
  },

  getTurnout: async (electionId: string) => {
    const response = await api.get<TurnoutResponse>(
      `/admin/elections/${electionId}/turnout`,
    );

    return response.data;
  },

  openElection: async (electionId: string) => {
    const response = await api.post<ElectionActionResponse>(
      `/admin/elections/${electionId}/open`,
    );

    return response.data;
  },

  closeElection: async (electionId: string) => {
    const response = await api.post<ElectionActionResponse>(
      `/admin/elections/${electionId}/close`,
    );

    return response.data;
  },
};
