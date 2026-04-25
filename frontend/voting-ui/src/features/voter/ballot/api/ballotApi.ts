import { api } from "@/shared/api/axios";
import type {
  BallotResponse,
  CastVoteRequest,
  CastVoteResponse,
  VoteStatusResponse,
} from "../types/ballotTypes";

export const ballotApi = {
  getBallot: async () => {
    const response = await api.get<BallotResponse>("/ballot");
    return response.data;
  },

  getVoteStatus: async (electionId: string) => {
    const response = await api.get<VoteStatusResponse>(
      `/votes/status/${electionId}`,
    );

    return response.data;
  },

  castVote: async (data: CastVoteRequest) => {
    const response = await api.post<CastVoteResponse>("/votes/cast", data);
    return response.data;
  },
};
