import { useEffect, useState } from "react";
import { api } from "@/shared/api/axios";
import { useNavigate } from "react-router-dom";
import { Alert } from "@/shared/ui/Alert";
import { Button } from "@/shared/ui/Button";
import { FormSelect } from "@/shared/ui/FormSelect";
import { PageCard } from "@/shared/ui/PageCard";
import { SectionCard } from "@/shared/ui/SectionCard";
import { getUserFriendlyErrorMessage } from "@/shared/utils/getUserFriendlyErrorMessage";

type Election = {
  id: string;
  name: string;
  status: string;
  startAt: string;
  endAt: string;
};

type TurnoutResponse = {
  eligible: number;
  voted: number;
};

export const AdminDashboardPage = () => {
  const navigate = useNavigate();

  const [elections, setElections] = useState<Election[]>([]);
  const [selectedElectionId, setSelectedElectionId] = useState("");

  const [turnout, setTurnout] = useState<TurnoutResponse | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingElections, setLoadingElections] = useState(true);

  const clearFeedback = () => {
    setMessage(null);
    setError(null);
  };

  const loadElections = async () => {
    try {
      setLoadingElections(true);
      const res = await api.get("/admin/elections");
      const loadedElections: Election[] = res.data;
      setElections(loadedElections);

      setSelectedElectionId((prev) => {
        if (prev && loadedElections.some((election) => election.id === prev)) {
          return prev;
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

  const handleGetTurnout = async () => {
    clearFeedback();

    if (!selectedElectionId) {
      setError("Please select an election first.");
      return;
    }

    try {
      const res = await api.get(
        `/admin/elections/${selectedElectionId}/turnout`,
      );
      setTurnout(res.data);
    } catch (err: unknown) {
      setError(getUserFriendlyErrorMessage(err, "loadTurnout"));
    }
  };

  const handleOpenElection = async () => {
    clearFeedback();

    if (!selectedElectionId) {
      setError("Please select an election first.");
      return;
    }

    try {
      const res = await api.post(`/admin/elections/${selectedElectionId}/open`);
      setMessage(res.data?.message ?? "Election opened.");
      setTurnout(null);
      await loadElections();
    } catch (err: unknown) {
      setError(getUserFriendlyErrorMessage(err, "openElection"));
    }
  };

  const handleCloseElection = async () => {
    clearFeedback();

    if (!selectedElectionId) {
      setError("Please select an election first.");
      return;
    }

    try {
      const res = await api.post(
        `/admin/elections/${selectedElectionId}/close`,
      );
      setMessage(res.data?.message ?? "Election closed.");
      setTurnout(null);
      await loadElections();
    } catch (err: unknown) {
      setError(getUserFriendlyErrorMessage(err, "closeElection"));
    }
  };

  const handleViewResults = () => {
    clearFeedback();

    if (!selectedElectionId) {
      setError("Please select an election first.");
      return;
    }

    navigate(`/results/${selectedElectionId}`);
  };

  const handleManageElections = () => {
    clearFeedback();
    navigate("/admin/manage-elections");
  };

  const handleManageCandidates = () => {
    clearFeedback();

    if (!selectedElectionId) {
      setError("Please select an election first.");
      return;
    }

    navigate(`/admin/manage-candidates/${selectedElectionId}`);
  };

  const handleManageVoters = () => {
    clearFeedback();

    if (!selectedElectionId) {
      setError("Please select an election first.");
      return;
    }

    navigate(`/admin/manage-voters/${selectedElectionId}`);
  };

  return (
    <PageCard title="Admin Dashboard" className="max-w-5xl space-y-8">
      {message && <Alert type="success">{message}</Alert>}
      {error && <Alert type="error">{error}</Alert>}

      <SectionCard title="Select Election" className="space-y-4">
        {loadingElections ? (
          <div className="text-gray-600">Loading elections...</div>
        ) : (
          <FormSelect
            label="Election"
            value={selectedElectionId}
            onChange={(e) => setSelectedElectionId(e.target.value)}
          >
            <option value="">Select election</option>
            {elections.map((election) => (
              <option key={election.id} value={election.id}>
                {election.name} ({election.status})
              </option>
            ))}
          </FormSelect>
        )}
      </SectionCard>

      <SectionCard title="Election Manager" className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <Button type="button" onClick={handleManageElections}>
            Manage Elections
          </Button>

          <Button type="button" onClick={handleManageCandidates}>
            Manage Candidates
          </Button>

          <Button type="button" onClick={handleManageVoters}>
            Manage Voters
          </Button>
        </div>
      </SectionCard>

      <SectionCard title="Election Controls" className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <Button type="button" onClick={handleGetTurnout}>
            View Turnout
          </Button>

          <Button type="button" variant="success" onClick={handleOpenElection}>
            Open Election
          </Button>

          <Button type="button" variant="danger" onClick={handleCloseElection}>
            Close Election
          </Button>

          <Button type="button" variant="secondary" onClick={handleViewResults}>
            View Results
          </Button>
        </div>

        {turnout && (
          <div className="rounded border bg-gray-50 p-4">
            <p>Eligible voters: {turnout.eligible}</p>
            <p>Votes cast: {turnout.voted}</p>
          </div>
        )}
      </SectionCard>
    </PageCard>
  );
};
