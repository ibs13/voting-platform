import { BackButton } from "@/shared/ui/BackButton";
import { PageCard } from "@/shared/ui/PageCard";
import { PageFeedback } from "@/shared/ui/PageFeedback";
import { CreateElectionForm } from "../components/CreateElectionForm";
import { DeleteElectionDialog } from "../components/DeleteElectionDialog";
import { ElectionTable } from "../components/ElectionTable";
import { useManageElections } from "../hooks/useManageElections";

export const ManageElectionPage = () => {
  const { form, feedback, table, deleteDialog } = useManageElections();

  return (
    <>
      <PageCard title="Manage Elections" className="max-w-5xl space-y-8">
        <BackButton to="/admin/dashboard" label="Back to Dashboard" />

        <PageFeedback message={feedback.message} error={feedback.error} />

        <CreateElectionForm
          name={form.name}
          startAt={form.startAt}
          endAt={form.endAt}
          onNameChange={form.setName}
          onStartAtChange={form.setStartAt}
          onEndAtChange={form.setEndAt}
          onSubmit={form.createElection}
        />

        <ElectionTable
          elections={table.elections}
          allElectionCount={table.allElectionCount}
          loading={table.loading}
          currentPage={table.currentPage}
          pageSize={table.pageSize}
          onPageChange={table.setCurrentPage}
          onDeleteClick={table.openDeleteDialog}
        />
      </PageCard>

      <DeleteElectionDialog
        open={deleteDialog.open}
        onConfirm={deleteDialog.onConfirm}
        onCancel={deleteDialog.onCancel}
      />
    </>
  );
};
