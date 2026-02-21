import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { useAuth } from "../context/AuthContext";

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
  const { electionId } = useAuth();

  const [data, setData] = useState<ResultsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!electionId) return;

    const fetchResults = async () => {
      try {
        const res = await api.get(`/results/${electionId}`);
        setData(res.data);
      } catch (err: any) {
        setError(err.response?.data || "Failed to load results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [electionId]);

  if (loading) return <div className="p-10">Loading results...</div>;
  if (error) return <div className="p-10 text-red-500">{error}</div>;
  if (!data) return null;

  const turnoutPercentage =
    data.totalEligibleVoters === 0
      ? 0
      : Math.round((data.totalVotesCast / data.totalEligibleVoters) * 100);

  return (
    <div className="min-h-screen bg-gray-100 py-10 flex justify-center">
      <div className="bg-white p-8 rounded shadow-md w-[800px]">
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

        {data.offices &&
          data.offices.map((office) => (
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
                        isWinner
                          ? "bg-green-100 border-green-400"
                          : "bg-gray-50"
                      }`}
                    >
                      <span>
                        {r.fullName}
                        {isWinner && (
                          <span className="ml-2 text-green-600 font-semibold">
                            (Winner)
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
