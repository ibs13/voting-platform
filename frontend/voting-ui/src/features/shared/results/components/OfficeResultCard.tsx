import { SectionCard } from "@/shared/ui/SectionCard";
import type { OfficeResult } from "../types/resultTypes";

type OfficeResultCardProps = {
  office: OfficeResult;
};

export const OfficeResultCard = ({ office }: OfficeResultCardProps) => {
  return (
    <SectionCard title={office.office} className="space-y-4">
      <div className="space-y-2">
        {office.results.map((candidate) => {
          const isWinner = office.winnerCandidateIds.includes(
            candidate.candidateId,
          );

          return (
            <div
              key={candidate.candidateId}
              className={`flex flex-col gap-2 rounded border p-3 sm:flex-row sm:items-center sm:justify-between ${
                isWinner ? "border-green-400 bg-green-100" : "bg-gray-50"
              }`}
            >
              <span>
                {candidate.fullName}

                {isWinner && (
                  <span className="ml-2 font-semibold text-green-700">
                    {office.isTie ? "(Tied Winner)" : "(Winner)"}
                  </span>
                )}
              </span>

              <span className="font-semibold">{candidate.voteCount} votes</span>
            </div>
          );
        })}
      </div>

      {office.isTie && (
        <div className="rounded border border-yellow-200 bg-yellow-50 p-3 font-semibold text-yellow-700">
          Tie detected. Runoff required.
        </div>
      )}
    </SectionCard>
  );
};
