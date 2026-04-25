import { Button } from "@/shared/ui/Button";
import { SectionCard } from "@/shared/ui/SectionCard";

type ElectionManagerActionsProps = {
  onManageElections: () => void;
  onManageCandidates: () => void;
  onManageVoters: () => void;
};

export const ElectionManagerActions = ({
  onManageElections,
  onManageCandidates,
  onManageVoters,
}: ElectionManagerActionsProps) => {
  return (
    <SectionCard title="Election Manager" className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button type="button" onClick={onManageElections}>
          Manage Elections
        </Button>

        <Button type="button" onClick={onManageCandidates}>
          Manage Candidates
        </Button>

        <Button type="button" onClick={onManageVoters}>
          Manage Voters
        </Button>
      </div>
    </SectionCard>
  );
};
