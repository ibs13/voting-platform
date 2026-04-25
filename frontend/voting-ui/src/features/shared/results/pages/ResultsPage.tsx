import { useParams } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { BackButton } from "@/shared/ui/BackButton";
import { PageCard } from "@/shared/ui/PageCard";
import { PageShell } from "@/shared/ui/PageShell";
import { ResultErrorState } from "@/features/shared/results/components/ResultErrorState";
import { ResultLoadingState } from "@/features/shared/results/components/ResultLoadingState";
import { ResultOfficeList } from "@/features/shared/results/components/ResultOfficeList";
import { ResultSummary } from "@/features/shared/results/components/ResultSummary";
import { useElectionResults } from "@/features/shared/results/hooks/useElectionResults";

export const ResultsPage = () => {
  const { electionId } = useParams<{ electionId: string }>();

  const { role } = useAuth();
  const isAdmin = role === "admin";

  const { result, status, error } = useElectionResults(electionId);

  if (status === "loading") {
    return <ResultLoadingState />;
  }

  if (status === "error" || !result) {
    return (
      <ResultErrorState
        message={error ?? "Something went wrong while loading results."}
      />
    );
  }

  return (
    <PageShell className="px-4 py-6 sm:py-10">
      <PageCard
        title={`${result.electionName} - Results`}
        className="w-[600px] space-y-8"
      >
        {isAdmin && (
          <BackButton to="/admin/dashboard" label="Back to Dashboard" />
        )}

        <ResultSummary result={result} />

        <ResultOfficeList offices={result.offices} />
      </PageCard>
    </PageShell>
  );
};
