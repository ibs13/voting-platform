import { Alert } from "@/shared/ui/Alert";
import { Button } from "@/shared/ui/Button";
import { FormInput } from "@/shared/ui/FormInput";
import { PageCard } from "@/shared/ui/PageCard";

type OtpVerificationFormProps = {
  email: string;
  otp: string;
  error: string | null;
  loading: boolean;
  onOtpChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export const OtpVerificationForm = ({
  email,
  otp,
  error,
  loading,
  onOtpChange,
  onSubmit,
}: OtpVerificationFormProps) => {
  return (
    <PageCard title="Verify OTP" className="w-full max-w-md">
      <form onSubmit={onSubmit} className="space-y-4">
        <p className="text-sm text-gray-600">
          Enter the OTP sent to{" "}
          <span className="font-medium text-gray-900">{email}</span>.
        </p>

        <FormInput
          type="text"
          label="OTP Code"
          required
          value={otp}
          onChange={(e) => onOtpChange(e.target.value)}
          placeholder="6-digit code"
        />

        {error && <Alert type="error">{error}</Alert>}

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>
      </form>
    </PageCard>
  );
};
