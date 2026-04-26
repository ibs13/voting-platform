import { Button } from "@/shared/ui/Button";
import { FormInput } from "@/shared/ui/FormInput";
import { FormSelect } from "@/shared/ui/FormSelect";
import { SectionCard } from "@/shared/ui/SectionCard";
import type { CandidateOffice } from "@/features/admin/candidates/types/candidateTypes";

type AddCandidateFormProps = {
  fullName: string;
  session: string;
  department: string;
  office: CandidateOffice;
  onFullNameChange: (value: string) => void;
  onSessionChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onOfficeChange: (value: CandidateOffice) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export const AddCandidateForm = ({
  fullName,
  session,
  department,
  office,
  onFullNameChange,
  onSessionChange,
  onDepartmentChange,
  onOfficeChange,
  onSubmit,
}: AddCandidateFormProps) => {
  return (
    <SectionCard title="Add Candidate" className="space-y-4">
      <form onSubmit={onSubmit} className="grid gap-3">
        <FormInput
          type="text"
          label="Candidate Full Name"
          placeholder="Candidate full name"
          value={fullName}
          onChange={(e) => onFullNameChange(e.target.value)}
          required
        />

        <FormInput
          type="text"
          label="Session"
          placeholder="Session"
          value={session}
          onChange={(e) => onSessionChange(e.target.value)}
        />

        <FormInput
          type="text"
          label="Department"
          placeholder="Department"
          value={department}
          onChange={(e) => onDepartmentChange(e.target.value)}
        />

        <FormSelect
          label="Office"
          value={office}
          onChange={(e) => onOfficeChange(e.target.value as CandidateOffice)}
          required
        >
          <option value="President">President</option>
          <option value="Secretary">Secretary</option>
          <option value="Treasurer">Treasurer</option>
        </FormSelect>

        <Button type="submit" variant="success" className="w-fit">
          Add Candidate
        </Button>
      </form>
    </SectionCard>
  );
};
