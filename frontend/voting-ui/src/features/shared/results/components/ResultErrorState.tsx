import { Alert } from "@/shared/ui/Alert";
import { PageCard } from "@/shared/ui/PageCard";
import { PageShell } from "@/shared/ui/PageShell";

type ResultErrorStateProps = {
  message: string;
};

export const ResultErrorState = ({ message }: ResultErrorStateProps) => {
  return (
    <PageShell centered className="px-4">
      <PageCard title="Election Results" className="w-full max-w-3xl">
        <Alert type="error">{message}</Alert>
      </PageCard>
    </PageShell>
  );
};
