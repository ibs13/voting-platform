import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { api } from "../api/axios";
import { useNavigate } from "react-router-dom";

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

function getApiErrorMessage(err: unknown, fallback: string): string {
  if (!(err instanceof AxiosError)) return fallback;

  const data = err.response?.data;

  if (typeof data === "string") return data;

  if (data && typeof data === "object") {
    const maybeErrors = (data as { errors?: unknown }).errors;
    const maybeTitle = (data as { title?: unknown }).title;
    const maybeMessage = (data as { message?: unknown }).message;

    if (maybeErrors && typeof maybeErrors === "object") {
      const messages = Object.values(
        maybeErrors as Record<string, unknown>,
      ).flatMap((value) => {
        if (Array.isArray(value)) {
          return value.filter(
            (item): item is string => typeof item === "string",
          );
        }

        return typeof value === "string" ? [value] : [];
      });

      if (messages.length > 0) {
        return messages.join(", ");
      }
    }

    if (typeof maybeMessage === "string" && maybeMessage.trim()) {
      return maybeMessage;
    }

    if (typeof maybeTitle === "string" && maybeTitle.trim()) {
      return maybeTitle;
    }
  }

  return fallback;
}

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
      setError(getApiErrorMessage(err, "Failed to load elections"));
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
      return;
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
      setError(getApiErrorMessage(err, "Failed to fetch turnout"));
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
      setError(getApiErrorMessage(err, "Failed to open election"));
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
      setError(getApiErrorMessage(err, "Failed to close election"));
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

    navigate(`/admin/manage-elections`);
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
    <div className="w-full max-w-5xl bg-white rounded-lg shadow-md p-8 space-y-8">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>

      {message && (
        <div className="p-3 rounded bg-green-50 text-green-700">{message}</div>
      )}

      {error && (
        <div className="p-3 rounded bg-red-50 text-red-700">{error}</div>
      )}

      <section className="border rounded p-4 space-y-4">
        <h3 className="text-lg font-semibold">Select Election</h3>

        {loadingElections ? (
          <div className="text-gray-600">Loading elections...</div>
        ) : (
          <select
            value={selectedElectionId}
            onChange={(e) => setSelectedElectionId(e.target.value)}
            className="border p-3 rounded w-full"
          >
            <option value="">Select election</option>
            {elections.map((election) => (
              <option key={election.id} value={election.id}>
                {election.name} ({election.status})
              </option>
            ))}
          </select>
        )}
      </section>

      <section className="border rounded p-4 space-y-4">
        <h3 className="text-lg font-semibold">Election Manager</h3>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleManageElections}
            className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700"
          >
            Manage Elections
          </button>

          <button
            type="button"
            onClick={handleManageCandidates}
            className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700"
          >
            Manage Candidates
          </button>

          <button
            type="button"
            onClick={handleManageVoters}
            className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700"
          >
            Manage Voters
          </button>
        </div>
      </section>

      <section className="border rounded p-4 space-y-4">
        <h3 className="text-lg font-semibold">Election Controls</h3>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleGetTurnout}
            className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700"
          >
            View Turnout
          </button>

          <button
            type="button"
            onClick={handleOpenElection}
            className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
          >
            Open Election
          </button>

          <button
            type="button"
            onClick={handleCloseElection}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Close Election
          </button>

          <button
            type="button"
            onClick={handleViewResults}
            className="bg-slate-700 text-white px-4 py-2 rounded hover:bg-slate-800"
          >
            View Results
          </button>
        </div>

        {turnout && (
          <div className="border rounded p-4 bg-gray-50">
            <p>Eligible voters: {turnout.eligible}</p>
            <p>Votes cast: {turnout.voted}</p>
          </div>
        )}
      </section>
    </div>
  );
};
