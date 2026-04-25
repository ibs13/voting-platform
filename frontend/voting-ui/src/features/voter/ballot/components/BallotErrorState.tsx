import { Alert } from "@/shared/ui/Alert";
import { PageShell } from "@/shared/ui/PageShell";

type BallotErrorStateProps = {
  message: string;
};

export const BallotErrorState = ({ message }: BallotErrorStateProps) => {
  return (
    <PageShell centered className="px-4">
      <Alert type="error">{message}</Alert>
    </PageShell>
  );
};
