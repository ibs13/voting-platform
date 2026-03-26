import { useState } from "react";
import { api } from "../api/axios";
import { useAuth } from "../context/AuthContext";

type TurnoutResponse = {
  eligible: number;
  voted: number;
};

export default function AdminDashboardPage() {
  const { electionId } = useAuth();

  const [turnout, setTurnout] = useState<TurnoutResponse | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentElectionId =
    electionId || "eb80b3eb-ef3e-4016-b7e5-e1801d45f2ea";

  const handleGetTurnout = async () => {
    setError(null);
    setMessage(null);

    try {
      const res = await api.get(
        `/admin/elections/${currentElectionId}/turnout`,
      );
      setTurnout(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch turnout");
    }
  };

  const handleOpenElection = async () => {
    setError(null);
    setMessage(null);

    try {
      const res = await api.post(`/admin/elections/${currentElectionId}/open`);
      setMessage(res.data.message);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to open election");
    }
  };

  const handleCloseElection = async () => {
    setError(null);
    setMessage(null);

    try {
      const res = await api.post(`/admin/elections/${currentElectionId}/close`);
      setMessage(res.data.message);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to close election");
    }
  };

  return (
    <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

      <div className="mb-6">
        <p className="text-sm text-gray-600 break-all">
          Election ID: {currentElectionId}
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={handleGetTurnout}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          View Turnout
        </button>

        <button
          onClick={handleOpenElection}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Open Election
        </button>

        <button
          onClick={handleCloseElection}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Close Election
        </button>
      </div>

      {message && (
        <div className="mb-4 p-3 rounded bg-green-50 text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-700">{error}</div>
      )}

      {turnout && (
        <div className="border rounded p-4 bg-gray-50">
          <h3 className="font-semibold mb-2">Turnout</h3>
          <p>Eligible voters: {turnout.eligible}</p>
          <p>Votes cast: {turnout.voted}</p>
        </div>
      )}
    </div>
  );
}
