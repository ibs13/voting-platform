import { api } from "@/shared/api/axios";
import type {
  CreateVoterRequest,
  DeleteVoterResponse,
  UploadVotersCsvResponse,
  Voter,
} from "../types/voterTypes";

export const voterApi = {
  getByElection: async (electionId: string) => {
    const response = await api.get<Voter[]>(
      `/admin/elections/${electionId}/voters`,
    );

    return response.data;
  },

  create: async (electionId: string, data: CreateVoterRequest) => {
    const response = await api.post<Voter>(
      `/admin/elections/${electionId}/voters`,
      data,
    );

    return response.data;
  },

  uploadCsv: async (electionId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<UploadVotersCsvResponse>(
      `/admin/elections/${electionId}/voters/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  },

  delete: async (voterId: string) => {
    const response = await api.delete<DeleteVoterResponse>(
      `/admin/elections/voters/${voterId}`,
    );

    return response.data;
  },
};
