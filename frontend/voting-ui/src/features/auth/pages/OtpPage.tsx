import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../shared/api/axios";
import { useAuth } from "../context/AuthContext";
import { Alert } from "../../../shared/ui/Alert";
import { getUserFriendlyErrorMessage } from "../../../shared/utils/getUserFriendlyErrorMessage";
import { Button } from "../../../shared/ui/Button";
import { FormInput } from "../../../shared/ui/FormInput";
import { PageCard } from "../../../shared/ui/PageCard";
import { PageShell } from "../../../shared/ui/PageShell";

export const OtpPage = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { electionId, email, setToken, setRole } = useAuth();

  if (!electionId || !email) {
    return (
      <div className="p-10">
        Your session has expired. Please go back and request a new OTP.
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/auth/verify-otp", {
        electionId,
        email,
        otp,
      });

      if (response) {
        const token = response.data.token;
        setToken(token);
        setRole("voter");

        navigate("/ballot");
      }
    } catch (err: unknown) {
      setError(getUserFriendlyErrorMessage(err, "otpVerify"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell centered>
      <h2 className="text-2xl font-bold mb-3 text-center"></h2>
      <PageCard title="Verify OTP" className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            type="text"
            label="OTP Code"
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="6-digit code"
          />

          {error && <Alert type="error">{error}</Alert>}

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>
      </PageCard>
    </PageShell>
  );
};
