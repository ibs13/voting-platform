import type { TurnoutResponse } from "../types/adminDashboardTypes";

type TurnoutSummaryProps = {
  turnout: TurnoutResponse | null;
};

export const TurnoutSummary = ({ turnout }: TurnoutSummaryProps) => {
  if (!turnout) return null;

  return (
    <div className="rounded border bg-gray-50 p-4 text-sm text-gray-700">
      <p>Eligible voters: {turnout.eligible}</p>
      <p>Votes cast: {turnout.voted}</p>
    </div>
  );
};
