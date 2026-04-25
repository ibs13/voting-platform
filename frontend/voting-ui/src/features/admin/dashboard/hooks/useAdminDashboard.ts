import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserFriendlyErrorMessage } from "@/shared/utils/getUserFriendlyErrorMessage";
import { adminDashboardApi } from "@/features/admin/dashboard/api/adminDashboardApi";
import type {
  DashboardElection,
  TurnoutResponse,
} from "../types/adminDashboardTypes";

export const useAdminDashboard = () => {
  const navigate = useNavigate();

  const [elections, setElections] = useState<DashboardElection[]>([]);
  const [selectedElectionId, setSelectedElectionId] = useState("");

  const [turnout, setTurnout] = useState<TurnoutResponse | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingElections, setLoadingElections] = useState(true);

  const clearFeedback = () => {
    setMessage(null);
    setError(null);
  };

  const requireSelectedElection = () => {
    if (!selectedElectionId) {
      setError("Please select an election first.");
      return null;
    }

    return selectedElectionId;
  };

  const loadElections = async () => {
    try {
      setLoadingElections(true);

      const loadedElections = await adminDashboardApi.getElections();

      setElections(loadedElections);

      setSelectedElectionId((previousElectionId) => {
        if (
          previousElectionId &&
          loadedElections.some((election) => election.id === previousElectionId)
        ) {
          return previousElectionId;
        }

        return loadedElections[0]?.id ?? "";
      });
    } catch (err: unknown) {
      setError(getUserFriendlyErrorMessage(err, "loadElections"));
    } finally {
      setLoadingElections(false);
    }
  };

  useEffect(() => {
    loadElections();
  }, []);

  useEffect(() => {
    if (!selectedElectionId) {
      setTurnout(null);
    }
  }, [selectedElectionId]);

  const viewTurnout = async () => {
    clearFeedback();

    const electionId = requireSelectedElection();
    if (!electionId) return;

    try {
      const loadedTurnout = await adminDashboardApi.getTurnout(electionId);
      setTurnout(loadedTurnout);
    } catch (err: unknown) {
      setError(getUserFriendlyErrorMessage(err, "loadTurnout"));
    }
  };

  const openElection = async () => {
    clearFeedback();

    const electionId = requireSelectedElection();
    if (!electionId) return;

    try {
      const response = await adminDashboardApi.openElection(electionId);

      setMessage(response?.message ?? "Election opened.");
      setTurnout(null);

      await loadElections();
    } catch (err: unknown) {
      setError(getUserFriendlyErrorMessage(err, "openElection"));
    }
  };

  const closeElection = async () => {
    clearFeedback();

    const electionId = requireSelectedElection();
    if (!electionId) return;

    try {
      const response = await adminDashboardApi.closeElection(electionId);

      setMessage(response?.message ?? "Election closed.");
      setTurnout(null);

      await loadElections();
    } catch (err: unknown) {
      setError(getUserFriendlyErrorMessage(err, "closeElection"));
    }
  };

  const viewResults = () => {
    clearFeedback();

    const electionId = requireSelectedElection();
    if (!electionId) return;

    navigate(`/results/${electionId}`);
  };

  const manageElections = () => {
    clearFeedback();
    navigate("/admin/manage-elections");
  };

  const manageCandidates = () => {
    clearFeedback();

    const electionId = requireSelectedElection();
    if (!electionId) return;

    navigate(`/admin/manage-candidates/${electionId}`);
  };

  const manageVoters = () => {
    clearFeedback();

    const electionId = requireSelectedElection();
    if (!electionId) return;

    navigate(`/admin/manage-voters/${electionId}`);
  };

  return {
    feedback: {
      message,
      error,
    },

    electionSelector: {
      elections,
      selectedElectionId,
      loading: loadingElections,
      setSelectedElectionId,
    },

    managerActions: {
      manageElections,
      manageCandidates,
      manageVoters,
    },

    controlActions: {
      turnout,
      viewTurnout,
      openElection,
      closeElection,
      viewResults,
    },
  };
};
