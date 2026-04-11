import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { api } from "../api/axios";

type Election = {
  id: string;
  name: string;
  status: string;
  startAt: string;
  endAt: string;
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

export const ManageElectionPage = () => {
  const [elections, setElections] = useState<Election[]>([]);

  const [name, setName] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
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
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Failed to load elections"));
    } finally {
      setLoadingElections(false);
    }
  };

  useEffect(() => {
    loadElections();
  }, []);

  const handleCreateElection = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();

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
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Failed to create election"));
    }
  };

  return (
    <div className="w-full max-w-5xl bg-white rounded-lg shadow-md p-8 space-y-8">
      <h2 className="text-2xl font-bold">Create Election</h2>

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
        <h3 className="text-lg font-semibold">Election List</h3>

        {loadingElections ? (
          <div className="text-gray-600">Loading elections...</div>
        ) : elections.length === 0 ? (
          <div className="text-gray-600">No elections found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Start Time
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    End Time
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {elections.map((election) => {
                  const statusClass =
                    election.status === "Open"
                      ? "bg-green-100 text-green-700"
                      : election.status === "Closed"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700";

                  return (
                    <tr key={election.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {election.name}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}
                        >
                          {election.status}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-700">
                        {election.startAt
                          ? new Date(election.startAt).toLocaleString()
                          : "N/A"}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-700">
                        {election.endAt
                          ? new Date(election.endAt).toLocaleString()
                          : "N/A"}
                      </td>

                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => handleDeleteElection(election.id)}
                          className="px-3 py-1.5 rounded text-sm font-medium bg-red-600 text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
