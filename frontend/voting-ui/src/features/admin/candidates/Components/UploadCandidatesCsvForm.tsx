import { Button } from "@/shared/ui/Button";
import { FormFileInput } from "@/shared/ui/FormFileInput";
import { SectionCard } from "@/shared/ui/SectionCard";

type UploadCandidatesCsvFormProps = {
  onFileChange: (file: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export const UploadCandidatesCsvForm = ({
  onFileChange,
  onSubmit,
}: UploadCandidatesCsvFormProps) => {
  return (
    <SectionCard title="Upload Candidates CSV" className="space-y-4">
      <form onSubmit={onSubmit} className="grid gap-3">
        <FormFileInput
          label="Candidate CSV File"
          accept=".csv"
          onChange={(e) => onFileChange(e.target.files?.[0] || null)}
        />

        <Button type="submit" variant="indigo" className="w-fit">
          Upload Candidates CSV
        </Button>
      </form>
    </SectionCard>
  );
};
