import { useEffect, useState, useCallback } from "react";
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

type Candidate = {
  id: string;
  fullName: string;
  batch: string | null;
  office: string;
};

type Voter = {
  id: string;
  email: string;
  isEligible: boolean;
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

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const [elections, setElections] = useState<Election[]>([]);
  const [selectedElectionId, setSelectedElectionId] = useState("");

  const [name, setName] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");

  const [candidateName, setCandidateName] = useState("");
  const [candidateBatch, setCandidateBatch] = useState("");
  const [candidateOffice, setCandidateOffice] = useState("President");

  const [voterEmail, setVoterEmail] = useState("");

  const [turnout, setTurnout] = useState<TurnoutResponse | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingElections, setLoadingElections] = useState(true);

  const [voterFile, setVoterFile] = useState<File | null>(null);
  const [candidateFile, setCandidateFile] = useState<File | null>(null);

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [voters, setVoters] = useState<Voter[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [loadingVoters, setLoadingVoters] = useState(false);

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

  const loadCandidates = async (electionId: string) => {
    if (!electionId) {
      setCandidates([]);
      return;
    }

    try {
      setLoadingCandidates(true);
      const res = await api.get(`/admin/elections/${electionId}/candidates`);
      setCandidates(res.data as Candidate[]);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Failed to load candidates"));
      setCandidates([]);
    } finally {
      setLoadingCandidates(false);
    }
  };

  const loadVoters = async (electionId: string) => {
    if (!electionId) {
      setVoters([]);
      return;
    }

    try {
      setLoadingVoters(true);
      const res = await api.get(`/admin/elections/${electionId}/voters`);
      setVoters(res.data as Voter[]);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Failed to load voters"));
      setVoters([]);
    } finally {
      setLoadingVoters(false);
    }
  };

  const loadLists = useCallback(async (electionId: string) => {
    await Promise.all([loadCandidates(electionId), loadVoters(electionId)]);
  }, []);

  useEffect(() => {
    loadElections();
  }, []);

  useEffect(() => {
    if (!selectedElectionId) {
      setCandidates([]);
      setVoters([]);
      setTurnout(null);
      return;
    }

    loadLists(selectedElectionId);
  }, [selectedElectionId, loadLists]);

  const handleCreateElection = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();
    setTurnout(null);

    try {
      const res = await api.post("/admin/elections", {
        name,
        startAt,
        endAt,
      });

      setMessage(`Election created: ${res.data.name}`);
      setName("");
      setStartAt("");
      setEndAt("");

      await loadElections();

      if (res.data?.id) {
        setSelectedElectionId(res.data.id);
        await loadLists(res.data.id);
      }
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Failed to create election"));
    }
  };

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();

    if (!selectedElectionId) {
      setError("Please select an election first.");
      return;
    }

    try {
      await api.post(`/admin/elections/${selectedElectionId}/candidates`, {
        fullName: candidateName,
        batch: candidateBatch.trim() || null,
        office: candidateOffice,
      });

      setMessage("Candidate added successfully.");
      setCandidateName("");
      setCandidateBatch("");
      setCandidateOffice("President");
      await loadCandidates(selectedElectionId);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Failed to add candidate"));
    }
  };

  const handleAddVoter = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();

    if (!selectedElectionId) {
      setError("Please select an election first.");
      return;
    }

    try {
      await api.post(`/admin/elections/${selectedElectionId}/voters`, {
        email: voterEmail,
      });

      setMessage("Voter added successfully.");
      setVoterEmail("");
      await loadVoters(selectedElectionId);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Failed to add voter"));
    }
  };

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

  const handleUploadVotersCsv = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();

    if (!selectedElectionId) {
      setError("Please select an election first.");
      return;
    }

    if (!voterFile) {
      setError("Please choose a voter CSV file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", voterFile);

      const res = await api.post(
        `/admin/elections/${selectedElectionId}/voters/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setMessage(
        `${res.data.message} Imported: ${res.data.imported}, Skipped: ${res.data.skipped}`,
      );
      setVoterFile(null);
      await loadVoters(selectedElectionId);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Failed to upload voter CSV"));
    }
  };

  const handleUploadCandidatesCsv = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();

    if (!selectedElectionId) {
      setError("Please select an election first.");
      return;
    }

    if (!candidateFile) {
      setError("Please choose a candidate CSV file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", candidateFile);

      const res = await api.post(
        `/admin/elections/${selectedElectionId}/candidates/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setMessage(
        `${res.data.message} Imported: ${res.data.imported}, Skipped: ${res.data.skipped}`,
      );
      setCandidateFile(null);
      await loadCandidates(selectedElectionId);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Failed to upload candidate CSV"));
    }
  };

  const handleDeleteCandidate = async (candidateId: string) => {
    clearFeedback();

    const confirmed = window.confirm(
      "Are you sure you want to delete this candidate?",
    );

    if (!confirmed) return;

    try {
      const res = await api.delete(
        `/admin/elections/candidates/${candidateId}`,
      );
      setMessage(res.data?.message ?? "Candidate deleted successfully.");
      await loadCandidates(selectedElectionId);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Failed to delete candidate"));
    }
  };

  const handleDeleteVoter = async (voterId: string) => {
    clearFeedback();

    const confirmed = window.confirm(
      "Are you sure you want to delete this voter?",
    );

    if (!confirmed) return;

    try {
      const res = await api.delete(`/admin/elections/voters/${voterId}`);
      setMessage(res.data?.message ?? "Voter deleted successfully.");
      await loadVoters(selectedElectionId);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Failed to delete voter"));
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
        <h3 className="text-lg font-semibold">Create Election</h3>

        <form onSubmit={handleCreateElection} className="grid gap-3">
          <input
            type="text"
            placeholder="Election name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-3 rounded"
            required
          />

          <input
            type="datetime-local"
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
            className="border p-3 rounded"
            required
          />

          <input
            type="datetime-local"
            value={endAt}
            onChange={(e) => setEndAt(e.target.value)}
            className="border p-3 rounded"
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-fit"
          >
            Create Election
          </button>
        </form>
      </section>

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
        <h3 className="text-lg font-semibold">Add Candidate</h3>

        <form onSubmit={handleAddCandidate} className="grid gap-3">
          <input
            type="text"
            placeholder="Candidate full name"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            className="border p-3 rounded"
            required
          />

          <input
            type="text"
            placeholder="Batch (optional)"
            value={candidateBatch}
            onChange={(e) => setCandidateBatch(e.target.value)}
            className="border p-3 rounded"
          />

          <select
            value={candidateOffice}
            onChange={(e) => setCandidateOffice(e.target.value)}
            className="border p-3 rounded"
            required
          >
            <option value="President">President</option>
            <option value="Secretary">Secretary</option>
            <option value="Treasurer">Treasurer</option>
          </select>

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-fit"
          >
            Add Candidate
          </button>
        </form>
      </section>

      <section className="border rounded p-4 space-y-4">
        <h3 className="text-lg font-semibold">Upload Candidates CSV</h3>

        <form onSubmit={handleUploadCandidatesCsv} className="grid gap-3">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setCandidateFile(e.target.files?.[0] || null)}
            className="border p-3 rounded"
          />

          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 w-fit"
          >
            Upload Candidates CSV
          </button>
        </form>
      </section>

      <section className="border rounded p-4 space-y-4">
        <h3 className="text-lg font-semibold">Candidate List</h3>

        {loadingCandidates ? (
          <div className="text-gray-600">Loading candidates...</div>
        ) : candidates.length === 0 ? (
          <div className="text-gray-600">No candidates found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border p-3 text-left">Full Name</th>
                  <th className="border p-3 text-left">Batch</th>
                  <th className="border p-3 text-left">Office</th>
                  <th className="border p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((candidate) => (
                  <tr key={candidate.id}>
                    <td className="border p-3">{candidate.fullName}</td>
                    <td className="border p-3">{candidate.batch || "-"}</td>
                    <td className="border p-3">{candidate.office}</td>
                    <td className="border p-3">
                      <button
                        type="button"
                        onClick={() => handleDeleteCandidate(candidate.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="border rounded p-4 space-y-4">
        <h3 className="text-lg font-semibold">Add Voter</h3>

        <form onSubmit={handleAddVoter} className="grid gap-3">
          <input
            type="email"
            placeholder="Voter email"
            value={voterEmail}
            onChange={(e) => setVoterEmail(e.target.value)}
            className="border p-3 rounded"
            required
          />

          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-fit"
          >
            Add Voter
          </button>
        </form>
      </section>

      <section className="border rounded p-4 space-y-4">
        <h3 className="text-lg font-semibold">Upload Voters CSV</h3>

        <form onSubmit={handleUploadVotersCsv} className="grid gap-3">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setVoterFile(e.target.files?.[0] || null)}
            className="border p-3 rounded"
          />

          <button
            type="submit"
            className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 w-fit"
          >
            Upload Voters CSV
          </button>
        </form>
      </section>

      <section className="border rounded p-4 space-y-4">
        <h3 className="text-lg font-semibold">Voter List</h3>

        {loadingVoters ? (
          <div className="text-gray-600">Loading voters...</div>
        ) : voters.length === 0 ? (
          <div className="text-gray-600">No voters found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border p-3 text-left">Email</th>
                  <th className="border p-3 text-left">Eligible</th>
                  <th className="border p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {voters.map((voter) => (
                  <tr key={voter.id}>
                    <td className="border p-3">{voter.email}</td>
                    <td className="border p-3">
                      {voter.isEligible ? "Yes" : "No"}
                    </td>
                    <td className="border p-3">
                      <button
                        type="button"
                        onClick={() => handleDeleteVoter(voter.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
}
