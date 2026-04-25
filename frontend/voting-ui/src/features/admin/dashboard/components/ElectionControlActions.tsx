import { Button } from "@/shared/ui/Button";
import { SectionCard } from "@/shared/ui/SectionCard";
import { TurnoutSummary } from "./TurnoutSummary";
import type { TurnoutResponse } from "../types/adminDashboardTypes";

type ElectionControlActionsProps = {
  turnout: TurnoutResponse | null;
  onViewTurnout: () => void;
  onOpenElection: () => void;
  onCloseElection: () => void;
  onViewResults: () => void;
};

export const ElectionControlActions = ({
  turnout,
  onViewTurnout,
  onOpenElection,
  onCloseElection,
  onViewResults,
}: ElectionControlActionsProps) => {
  return (
    <SectionCard title="Election Controls" className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button type="button" onClick={onViewTurnout}>
          View Turnout
        </Button>

        <Button type="button" variant="success" onClick={onOpenElection}>
          Open Election
        </Button>

        <Button type="button" variant="danger" onClick={onCloseElection}>
          Close Election
        </Button>

        <Button type="button" variant="secondary" onClick={onViewResults}>
          View Results
        </Button>
      </div>

      <TurnoutSummary turnout={turnout} />
    </SectionCard>
  );
};
