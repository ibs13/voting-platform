import { Alert } from "@/shared/ui/Alert";
import { Button } from "@/shared/ui/Button";
import { PageCard } from "@/shared/ui/PageCard";
import { PageShell } from "@/shared/ui/PageShell";

type OtpSessionExpiredStateProps = {
  onBackToEmail: () => void;
};

export const OtpSessionExpiredState = ({
  onBackToEmail,
}: OtpSessionExpiredStateProps) => {
  return (
    <PageShell centered className="px-4">
      <PageCard title="Verify OTP" className="w-full max-w-md">
        <div className="space-y-4">
          <Alert type="error">
            Your session has expired. Please request a new OTP.
          </Alert>

          <Button type="button" fullWidth onClick={onBackToEmail}>
            Back to Email Login
          </Button>
        </div>
      </PageCard>
    </PageShell>
  );
};
