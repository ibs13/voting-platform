import { FormSelect } from "@/shared/ui/FormSelect";
import { SectionCard } from "@/shared/ui/SectionCard";
import type { DashboardElection } from "../types/adminDashboardTypes";

type ElectionSelectorProps = {
  elections: DashboardElection[];
  selectedElectionId: string;
  loading: boolean;
  onElectionChange: (electionId: string) => void;
};

export const ElectionSelector = ({
  elections,
  selectedElectionId,
  loading,
  onElectionChange,
}: ElectionSelectorProps) => {
  return (
    <SectionCard title="Select Election" className="space-y-4">
      {loading ? (
        <div className="text-gray-600">Loading elections...</div>
      ) : (
        <FormSelect
          label="Election"
          value={selectedElectionId}
          onChange={(e) => onElectionChange(e.target.value)}
        >
          <option value="">Select election</option>
          {elections.map((election) => (
            <option key={election.id} value={election.id}>
              {election.name} ({election.status})
            </option>
          ))}
        </FormSelect>
      )}
    </SectionCard>
  );
};
