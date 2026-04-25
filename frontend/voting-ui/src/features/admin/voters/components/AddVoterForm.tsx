import { Button } from "@/shared/ui/Button";
import { FormInput } from "@/shared/ui/FormInput";
import { SectionCard } from "@/shared/ui/SectionCard";

type AddVoterFormProps = {
  name: string;
  email: string;
  session: string;
  department: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onSessionChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export const AddVoterForm = ({
  name,
  email,
  session,
  department,
  onNameChange,
  onEmailChange,
  onSessionChange,
  onDepartmentChange,
  onSubmit,
}: AddVoterFormProps) => {
  return (
    <SectionCard title="Add Voter" className="space-y-4">
      <form onSubmit={onSubmit} className="grid gap-3">
        <FormInput
          type="text"
          label="Voter Name"
          placeholder="Voter full name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          required
        />

        <FormInput
          type="email"
          label="Voter Email"
          placeholder="Voter email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
        />

        <FormInput
          type="text"
          label="Session"
          placeholder="e.g. 2021-22"
          value={session}
          onChange={(e) => onSessionChange(e.target.value)}
          required
        />

        <FormInput
          type="text"
          label="Department"
          placeholder="e.g. CSE"
          value={department}
          onChange={(e) => onDepartmentChange(e.target.value)}
          required
        />

        <Button type="submit" variant="purple" className="w-fit">
          Add Voter
        </Button>
      </form>
    </SectionCard>
  );
};
