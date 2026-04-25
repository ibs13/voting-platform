import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { getUserFriendlyErrorMessage } from "@/shared/utils/getUserFriendlyErrorMessage";
import { ballotApi } from "@/features/voter/ballot/api/ballotApi";
import type {
  BallotCandidate,
  BallotStatus,
  Office,
  SelectedCandidates,
} from "../types/ballotTypes";

const initialSelectedCandidates: SelectedCandidates = {
  President: "",
  Secretary: "",
  Treasurer: "",
};

export const useBallot = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const { isAuthReady } = auth;
  const isAuthenticated =
    (auth as { isAuthenticated?: boolean }).isAuthenticated ?? false;

  const [status, setStatus] = useState<BallotStatus>("checking");
  const [error, setError] = useState<string | null>(null);

  const [electionId, setElectionId] = useState("");
  const [electionName, setElectionName] = useState("");
  const [candidates, setCandidates] = useState<BallotCandidate[]>([]);

  const [selectedCandidates, setSelectedCandidates] =
    useState<SelectedCandidates>(initialSelectedCandidates);

  const [submitting, setSubmitting] = useState(false);

  const candidatesByOffice = useMemo(() => {
    return {
      President: candidates.filter(
        (candidate) => candidate.office === "President",
      ),
      Secretary: candidates.filter(
        (candidate) => candidate.office === "Secretary",
      ),
      Treasurer: candidates.filter(
        (candidate) => candidate.office === "Treasurer",
      ),
    };
  }, [candidates]);

  const loadBallot = useCallback(async () => {
    if (!isAuthReady) {
      setStatus("checking");
      return;
    }

    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    try {
      setStatus("loading");
      setError(null);

      const ballot = await ballotApi.getBallot();

      const voteStatus = await ballotApi.getVoteStatus(ballot.electionId);

      if (voteStatus.hasVoted) {
        navigate("/success");
        return;
      }

      setElectionId(ballot.electionId);
      setElectionName(ballot.electionName);
      setCandidates(ballot.candidates);
      setStatus("ready");
    } catch (err: unknown) {
      setError(getUserFriendlyErrorMessage(err));
      setStatus("error");
    }
  }, [isAuthReady, isAuthenticated, navigate]);

  useEffect(() => {
    loadBallot();
  }, [loadBallot]);

  const updateSelectedCandidate = (office: Office, candidateId: string) => {
    setSelectedCandidates((previous) => ({
      ...previous,
      [office]: candidateId,
    }));
  };

  const validateSelection = () => {
    if (
      !selectedCandidates.President ||
      !selectedCandidates.Secretary ||
      !selectedCandidates.Treasurer
    ) {
      setError("Please select one candidate for each office.");
      setStatus("error");
      return false;
    }

    return true;
  };

  const submitVote = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateSelection()) return;

    try {
      setSubmitting(true);
      setError(null);

      await ballotApi.castVote({
        electionId,
        votes: [
          {
            office: "President",
            candidateId: selectedCandidates.President,
          },
          {
            office: "Secretary",
            candidateId: selectedCandidates.Secretary,
          },
          {
            office: "Treasurer",
            candidateId: selectedCandidates.Treasurer,
          },
        ],
      });

      navigate("/success");
    } catch (err: unknown) {
      setError(getUserFriendlyErrorMessage(err));
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    status,
    error,

    form: {
      electionName,
      candidatesByOffice,
      selectedCandidates,
      submitting,
      updateSelectedCandidate,
      submitVote,
    },
  };
};
