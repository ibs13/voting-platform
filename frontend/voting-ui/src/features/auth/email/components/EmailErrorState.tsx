import { Alert } from "@/shared/ui/Alert";
import { PageCard } from "@/shared/ui/PageCard";
import { PageShell } from "@/shared/ui/PageShell";

type EmailErrorStateProps = {
  message: string;
};

export const EmailErrorState = ({ message }: EmailErrorStateProps) => {
  return (
    <PageShell centered className="px-4">
      <PageCard title="Election Not Available" className="w-full max-w-md">
        <Alert type="error">{message}</Alert>
      </PageCard>
    </PageShell>
  );
};
