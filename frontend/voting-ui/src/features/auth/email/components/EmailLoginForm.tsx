import { Alert } from "@/shared/ui/Alert";
import { Button } from "@/shared/ui/Button";
import { FormInput } from "@/shared/ui/FormInput";
import { PageCard } from "@/shared/ui/PageCard";
import type { ActiveElectionResponse } from "../types/emailLoginTypes";

type EmailLoginFormProps = {
  email: string;
  activeElection: ActiveElectionResponse | null;
  error: string | null;
  loading: boolean;
  onEmailChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export const EmailLoginForm = ({
  email,
  activeElection,
  error,
  loading,
  onEmailChange,
  onSubmit,
}: EmailLoginFormProps) => {
  return (
    <PageCard title="Enter Your Email" className="w-full max-w-md">
      <form onSubmit={onSubmit} className="space-y-4">
        {activeElection && (
          <div className="rounded border bg-gray-50 p-3 text-sm text-gray-700">
            Active election:{" "}
            <span className="font-medium text-gray-900">
              {activeElection.name}
            </span>
          </div>
        )}

        <FormInput
          type="email"
          label="Email Address"
          required
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="you@example.com"
        />

        {error && <Alert type="error">{error}</Alert>}

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "Sending..." : "Send OTP"}
        </Button>

        <p className="pt-2 text-xs text-gray-500">
          You may request a new OTP after 30 seconds.
        </p>
      </form>
    </PageCard>
  );
};
