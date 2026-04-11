import { useEffect, useState, useCallback } from "react";
import { AxiosError } from "axios";
import { api } from "../api/axios";
import { useParams } from "react-router-dom";

type Candidate = {
  id: string;
  fullName: string;
  batch: string | null;
  office: string;
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

export const ManageCandidatePage = () => {
  const { electionId } = useParams<{ electionId: string }>();

  const [candidateName, setCandidateName] = useState("");
  const [candidateBatch, setCandidateBatch] = useState("");
  const [candidateOffice, setCandidateOffice] = useState("President");

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [candidateFile, setCandidateFile] = useState<File | null>(null);

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);

  const clearFeedback = () => {
    setMessage(null);
    setError(null);
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

  const loadLists = useCallback(async (electionId: string) => {
    await Promise.all([loadCandidates(electionId)]);
  }, []);

  useEffect(() => {
    if (!electionId) {
      setCandidates([]);
      return;
    }

    loadLists(electionId);
  }, [electionId, loadLists]);

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();

    if (!electionId) {
      setError("Please select an election first.");
      return;
    }

    try {
      await api.post(`/admin/elections/${electionId}/candidates`, {
        fullName: candidateName,
        batch: candidateBatch.trim() || null,
        office: candidateOffice,
      });

      setMessage("Candidate added successfully.");
      setCandidateName("");
      setCandidateBatch("");
      setCandidateOffice("President");
      await loadCandidates(electionId);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Failed to add candidate"));
    }
  };

  const handleUploadCandidatesCsv = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();

    if (!electionId) {
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
        `/admin/elections/${electionId!}/candidates/upload`,
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
      await loadCandidates(electionId);
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
      await loadCandidates(electionId!);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Failed to delete candidate"));
    }
  };

  if (error === "Election not found.") {
    return (
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold">Manage Candidates</h2>
        <div className="p-3 rounded bg-amber-50 text-amber-700 mt-4">
          {error}
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-md p-8 space-y-8">
        <h2 className="text-2xl font-bold">Manage Candidates</h2>

        {message && (
          <div className="p-3 rounded bg-green-50 text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="p-3 rounded bg-red-50 text-red-700">{error}</div>
        )}

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
      </div>
    );
  }
};
