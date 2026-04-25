import { Button } from "@/shared/ui/Button";
import { FormInput } from "@/shared/ui/FormInput";
import { SectionCard } from "@/shared/ui/SectionCard";

type CreateElectionFormProps = {
  name: string;
  startAt: string;
  endAt: string;
  onNameChange: (value: string) => void;
  onStartAtChange: (value: string) => void;
  onEndAtChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export const CreateElectionForm = ({
  name,
  startAt,
  endAt,
  onNameChange,
  onStartAtChange,
  onEndAtChange,
  onSubmit,
}: CreateElectionFormProps) => {
  return (
    <SectionCard title="Create Election" className="space-y-4">
      <form onSubmit={onSubmit} className="grid gap-3">
        <FormInput
          type="text"
          label="Election Name"
          placeholder="Election name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          required
        />

        <FormInput
          type="datetime-local"
          label="Start Time"
          value={startAt}
          onChange={(e) => onStartAtChange(e.target.value)}
          required
        />

        <FormInput
          type="datetime-local"
          label="End Time"
          value={endAt}
          onChange={(e) => onEndAtChange(e.target.value)}
          required
        />

        <Button type="submit" className="w-fit">
          Create Election
        </Button>
      </form>
    </SectionCard>
  );
};
