import { Alert } from "@/shared/ui/Alert";
import { PageShell } from "@/shared/ui/PageShell";

export const ResultLoadingState = () => {
  return (
    <PageShell centered className="px-4">
      <Alert type="info">Loading results...</Alert>
    </PageShell>
  );
};
