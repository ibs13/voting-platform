import { Alert } from "@/shared/ui/Alert";
import { PageShell } from "@/shared/ui/PageShell";

type BallotLoadingStateProps = {
  message: string;
};

export const BallotLoadingState = ({ message }: BallotLoadingStateProps) => {
  return (
    <PageShell centered className="px-4">
      <Alert type="info">{message}</Alert>
    </PageShell>
  );
};
