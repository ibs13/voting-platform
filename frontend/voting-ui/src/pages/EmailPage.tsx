import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Alert } from "../components/ui/Alert";
import { getUserFriendlyErrorMessage } from "../utils/getUserFriendlyErrorMessage";
import { Button } from "../components/ui/Button";
import { FormInput } from "../components/ui/FormInput";
import { PageCard } from "../components/ui/PageCard";
import { PageShell } from "../components/ui/PageShell";

type ActiveElectionResponse = {
  id: string;
  name: string;
  status: string;
  startAt: string;
  endAt: string;
};

export const EmailPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);
  const [activeElection, setActiveElection] =
    useState<ActiveElectionResponse | null>(null);

  const navigate = useNavigate();
  const { setElectionId, setEmail: setAuthEmail } = useAuth();

  useEffect(() => {
    const loadActiveElection = async () => {
      try {
        setPageError(null);

        const response =
          await api.get<ActiveElectionResponse>("/elections/active");
        const election = response.data;

        setActiveElection(election);
        setElectionId(election.id);
      } catch (error: unknown) {
        setPageError(getUserFriendlyErrorMessage(error, "emailRequestOtp"));
      } finally {
        setPageLoading(false);
      }
    };

    loadActiveElection();
  }, [setElectionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeElection) {
      setError("No active election is available right now.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      await api.post("/auth/request-otp", {
        email,
      });

      setElectionId(activeElection.id);
      setAuthEmail(email);

      navigate("/otp");
    } catch (error: unknown) {
      setError(getUserFriendlyErrorMessage(error, "emailRequestOtp"));
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
          <p className="text-gray-600">Loading election...</p>
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow">
          <h1 className="text-2xl font-bold mb-4">Election Not Available</h1>
          <p className="text-gray-600">{pageError}</p>
        </div>
      </div>
    );
  }

  return (
    <PageShell centered>
      <PageCard title="Enter Your Email" className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            type="email"
            label="Email Address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
    </PageShell>
  );
};
