import { Button } from "@/shared/ui/Button";
import { FormFileInput } from "@/shared/ui/FormFileInput";
import { SectionCard } from "@/shared/ui/SectionCard";

type UploadVotersCsvFormProps = {
  onFileChange: (file: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export const UploadVotersCsvForm = ({
  onFileChange,
  onSubmit,
}: UploadVotersCsvFormProps) => {
  return (
    <SectionCard title="Upload Voters CSV" className="space-y-4">
      <form onSubmit={onSubmit} className="grid gap-3">
        <FormFileInput
          label="Voter CSV File"
          accept=".csv"
          onChange={(e) => onFileChange(e.target.files?.[0] || null)}
        />

        <Button type="submit" variant="pink" className="w-fit">
          Upload Voters CSV
        </Button>
      </form>
    </SectionCard>
  );
};
