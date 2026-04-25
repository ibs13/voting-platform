import { Button } from "@/shared/ui/Button";
import { FormSelect } from "@/shared/ui/FormSelect";
import { PageShell } from "@/shared/ui/PageShell";
import type {
  BallotCandidate,
  Office,
  SelectedCandidates,
} from "../types/ballotTypes";

type BallotFormProps = {
  electionName: string;
  candidatesByOffice: Record<Office, BallotCandidate[]>;
  selectedCandidates: SelectedCandidates;
  submitting: boolean;
  onCandidateChange: (office: Office, candidateId: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export const BallotForm = ({
  electionName,
  candidatesByOffice,
  selectedCandidates,
  submitting,
  onCandidateChange,
  onSubmit,
}: BallotFormProps) => {
  const offices: Office[] = ["President", "Secretary", "Treasurer"];

  return (
    <PageShell className="px-4 py-6 sm:py-10">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-md sm:p-8"
      >
        <div className="mb-6 space-y-2 text-center">
          <h2 className="text-2xl font-bold">Cast Your Vote</h2>
          <p className="text-sm text-gray-600">{electionName}</p>
        </div>

        <div className="space-y-5">
          {offices.map((office) => (
            <FormSelect
              key={office}
              label={office}
              value={selectedCandidates[office]}
              onChange={(e) => onCandidateChange(office, e.target.value)}
              required
            >
              <option value="">Select candidate</option>

              {candidatesByOffice[office].map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.fullName}
                  {candidate.session ? ` - ${candidate.session}` : ""}
                  {candidate.department ? ` - ${candidate.department}` : ""}
                </option>
              ))}
            </FormSelect>
          ))}
        </div>

        <Button type="submit" fullWidth className="mt-6" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Vote"}
        </Button>
      </form>
    </PageShell>
  );
};
