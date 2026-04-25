import { api } from "@/shared/api/axios";
import type {
  Candidate,
  CreateCandidateRequest,
  DeleteCandidateResponse,
  UploadCandidatesCsvResponse,
} from "../types/candidateTypes";

export const candidateApi = {
  getByElection: async (electionId: string) => {
    const response = await api.get<Candidate[]>(
      `/admin/elections/${electionId}/candidates`,
    );

    return response.data;
  },

  create: async (electionId: string, data: CreateCandidateRequest) => {
    const response = await api.post<Candidate>(
      `/admin/elections/${electionId}/candidates`,
      data,
    );

    return response.data;
  },

  uploadCsv: async (electionId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<UploadCandidatesCsvResponse>(
      `/admin/elections/${electionId}/candidates/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  },

  delete: async (candidateId: string) => {
    const response = await api.delete<DeleteCandidateResponse>(
      `/admin/elections/candidates/${candidateId}`,
    );

    return response.data;
  },
};
