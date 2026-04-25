import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { useParams } from "react-router-dom";
import { api } from "@/shared/api/axios";
import { PageShell } from "@/shared/ui/PageShell";

type CandidateResult = {
  candidateId: string;
  fullName: string;
  voteCount: number;
};

type OfficeResult = {
  office: string;
  results: CandidateResult[];
  winnerCandidateIds: string[];
  isTie: boolean;
};

type ResultsResponse = {
  electionId: string;
  electionName: string;
  totalEligibleVoters: number;
  totalVotesCast: number;
  offices: OfficeResult[];
};

export const ResultsPage = () => {
  const { electionId } = useParams<{ electionId: string }>();

  const [data, setData] = useState<ResultsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!electionId) {
      setError("Election id is missing.");
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await api.get(`/results/${electionId}`);
        setData(res.data);
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          if (err.response?.status === 403) {
            setError(
              "This election is still open. Results will be available after the election is closed.",
            );
          } else if (err.response?.status === 404) {
            setError("Election not found.");
          } else if (err.response?.status === 401) {
            setError("You need to log in to view results.");
          } else if (typeof err.response?.data === "string") {
            setError(err.response.data);
          } else {
            setError("Failed to load results.");
          }
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load results.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [electionId]);

  if (loading) {
    return <div className="p-10">Loading results...</div>;
  }

  if (error) {
    return (
      <PageShell>
        <div className="bg-white p-8 rounded shadow-md md:w-[800px]">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Election Results
          </h2>
          <div className="rounded border border-amber-200 bg-amber-50 p-4 text-amber-800">
            {error}
          </div>
        </div>
      </PageShell>
    );
  }

  if (!data) return null;

  const turnoutPercentage =
    data.totalEligibleVoters === 0
      ? 0
      : Math.round((data.totalVotesCast / data.totalEligibleVoters) * 100);

  return (
    <div className="min-h-screen bg-gray-100 py-10 flex justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full md:w-[800px]">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {data.electionName} - Results
        </h2>

        <div className="mb-6 text-center">
          <p>
            Turnout:{" "}
            <span className="font-semibold">
              {data.totalVotesCast} / {data.totalEligibleVoters}
            </span>{" "}
            ({turnoutPercentage}%)
          </p>
        </div>

        {data.offices.map((office) => (
          <div key={office.office} className="mb-8">
            <h3 className="text-xl font-semibold mb-3">{office.office}</h3>

            <div className="space-y-2">
              {office.results.map((r) => {
                const isWinner = office.winnerCandidateIds.includes(
                  r.candidateId,
                );

                return (
                  <div
                    key={r.candidateId}
                    className={`p-3 rounded border flex justify-between ${
                      isWinner ? "bg-green-100 border-green-400" : "bg-gray-50"
                    }`}
                  >
                    <span>
                      {r.fullName}
                      {isWinner && (
                        <span className="ml-2 text-green-600 font-semibold">
                          {office.isTie ? "(Tied Winner)" : "(Winner)"}
                        </span>
                      )}
                    </span>

                    <span className="font-semibold">{r.voteCount} votes</span>
                  </div>
                );
              })}
            </div>

            {office.isTie && (
              <div className="mt-3 text-yellow-600 font-semibold">
                Tie detected — runoff required
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
