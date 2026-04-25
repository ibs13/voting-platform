import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Button } from "@/shared/ui/Button";
import { PageCard } from "@/shared/ui/PageCard";
import { PageShell } from "@/shared/ui/PageShell";

export const SuccessPage = () => {
  const { electionId } = useAuth();
  const navigate = useNavigate();

  const handleViewResults = () => {
    if (!electionId) return;
    navigate(`/results/${electionId}`);
  };

  return (
    <PageShell centered className="px-4">
      <PageCard title="Vote Submitted Successfully" className="w-full max-w-md">
        <div className="space-y-4">
          <p className="text-gray-700">
            Thank you. Your vote has been recorded.
          </p>

          <p className="text-sm text-gray-600">
            Results will be available after the election is closed.
          </p>

          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={handleViewResults}
          >
            View Results
          </Button>
        </div>
      </PageCard>
    </PageShell>
  );
};
