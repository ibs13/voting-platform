import { PageCard } from "@/shared/ui/PageCard";
import { PageFeedback } from "@/shared/ui/PageFeedback";
import { ElectionControlActions } from "@/features/admin/dashboard/components/ElectionControlActions";
import { ElectionManagerActions } from "@/features/admin/dashboard/components/ElectionManagerActions";
import { ElectionSelector } from "@/features/admin/dashboard/components/ElectionSelector";
import { useAdminDashboard } from "@/features/admin/dashboard/hooks/useAdminDashboard";

export const AdminDashboardPage = () => {
  const { feedback, electionSelector, managerActions, controlActions } =
    useAdminDashboard();

  return (
    <PageCard title="Admin Dashboard" className="max-w-5xl space-y-8">
      <PageFeedback message={feedback.message} error={feedback.error} />

      <ElectionSelector
        elections={electionSelector.elections}
        selectedElectionId={electionSelector.selectedElectionId}
        loading={electionSelector.loading}
        onElectionChange={electionSelector.setSelectedElectionId}
      />

      <ElectionManagerActions
        onManageElections={managerActions.manageElections}
        onManageCandidates={managerActions.manageCandidates}
        onManageVoters={managerActions.manageVoters}
      />

      <ElectionControlActions
        turnout={controlActions.turnout}
        onViewTurnout={controlActions.viewTurnout}
        onOpenElection={controlActions.openElection}
        onCloseElection={controlActions.closeElection}
        onViewResults={controlActions.viewResults}
      />
    </PageCard>
  );
};
