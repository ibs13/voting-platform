import { SectionCard } from "@/shared/ui/SectionCard";
import type { ResultsResponse } from "../types/resultTypes";

type ResultSummaryProps = {
  result: ResultsResponse;
};

export const ResultSummary = ({ result }: ResultSummaryProps) => {
  const turnoutPercentage =
    result.totalEligibleVoters === 0
      ? 0
      : Math.round((result.totalVotesCast / result.totalEligibleVoters) * 100);

  return (
    <SectionCard title="Turnout Summary" className="space-y-3">
      <div className="grid gap-4 text-sm text-gray-700 sm:grid-cols-3">
        <div>
          <p className="font-medium text-gray-900">Votes Cast</p>
          <p>{result.totalVotesCast}</p>
        </div>

        <div>
          <p className="font-medium text-gray-900">Eligible Voters</p>
          <p>{result.totalEligibleVoters}</p>
        </div>

        <div>
          <p className="font-medium text-gray-900">Turnout</p>
          <p>{turnoutPercentage}%</p>
        </div>
      </div>
    </SectionCard>
  );
};
