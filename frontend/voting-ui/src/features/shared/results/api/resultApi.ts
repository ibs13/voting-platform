import { api } from "@/shared/api/axios";
import type { ResultsResponse } from "@/features/shared/results/types/resultTypes";

export const resultApi = {
  getByElection: async (electionId: string) => {
    const response = await api.get<ResultsResponse>(`/results/${electionId}`);
    return response.data;
  },
};
