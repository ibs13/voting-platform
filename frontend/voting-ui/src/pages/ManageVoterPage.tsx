import { useEffect, useState, useCallback } from "react";
import { AxiosError } from "axios";
import { api } from "../api/axios";
import { useParams } from "react-router-dom";

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

export const ManageVoterPage = () => {
  const { electionId } = useParams<{ electionId: string }>();

  const [voterEmail, setVoterEmail] = useState("");

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [voterFile, setVoterFile] = useState<File | null>(null);

  const [voters, setVoters] = useState<Voter[]>([]);
  const [loadingVoters, setLoadingVoters] = useState(false);

  const clearFeedback = () => {
    setMessage(null);
    setError(null);
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
    await Promise.all([loadVoters(electionId)]);
  }, []);

  useEffect(() => {
    if (!electionId) {
      setVoters([]);
      return;
    }

    loadLists(electionId);
  }, [electionId, loadLists]);

  const handleAddVoter = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();

    if (!electionId) {
      setError("Please select an election first.");
      return;
    }

    try {
      await api.post(`/admin/elections/${electionId}/voters`, {
        email: voterEmail,
      });

      setMessage("Voter added successfully.");
      setVoterEmail("");
      await loadVoters(electionId);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Failed to add voter"));
    }
  };

  const handleUploadVotersCsv = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();

    if (!electionId) {
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
        `/admin/elections/${electionId}/voters/upload`,
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
      await loadVoters(electionId);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Failed to upload voter CSV"));
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
      await loadVoters(electionId!);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Failed to delete voter"));
    }
  };

  if (error === "Election not found.") {
    return (
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold">Manage Voters</h2>
        <div className="p-3 rounded bg-amber-50 text-amber-700 mt-4">
          {error}
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-md p-8 space-y-8">
        <h2 className="text-2xl font-bold">Manage Voters</h2>

        {message && (
          <div className="p-3 rounded bg-green-50 text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="p-3 rounded bg-red-50 text-red-700">{error}</div>
        )}

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
      </div>
    );
  }
};
