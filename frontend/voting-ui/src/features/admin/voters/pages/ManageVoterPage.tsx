import { useParams } from "react-router-dom";
import { BackButton } from "@/shared/ui/BackButton";
import { PageCard } from "@/shared/ui/PageCard";
import { PageFeedback } from "@/shared/ui/PageFeedback";
import { AddVoterForm } from "../components/AddVoterForm";
import { DeleteVoterDialog } from "../components/DeleteVoterDialog";
import { UploadVotersCsvForm } from "../components/UploadVotersCsvForm";
import { VoterTable } from "../components/VoterTable";
import { useManageVoters } from "../hooks/useManageVoters";

export const ManageVoterPage = () => {
  const { electionId } = useParams<{ electionId: string }>();

  const { form, csvUpload, feedback, table, deleteDialog } =
    useManageVoters(electionId);

  if (feedback.error === "This election could not be found.") {
    return (
      <PageCard title="Manage Voters" className="max-w-5xl space-y-8">
        <BackButton to="/admin/dashboard" label="Back to Dashboard" />

        <PageFeedback error="Election not found. Please select a valid election." />
      </PageCard>
    );
  }

  return (
    <>
      <PageCard title="Manage Voters" className="max-w-5xl space-y-8">
        <BackButton to="/admin/dashboard" label="Back to Dashboard" />

        <PageFeedback message={feedback.message} error={feedback.error} />

        <AddVoterForm
          name={form.voterName}
          email={form.voterEmail}
          session={form.voterSession}
          department={form.voterDepartment}
          onNameChange={form.setVoterName}
          onEmailChange={form.setVoterEmail}
          onSessionChange={form.setVoterSession}
          onDepartmentChange={form.setVoterDepartment}
          onSubmit={form.createVoter}
        />

        <UploadVotersCsvForm
          onFileChange={csvUpload.setVoterFile}
          onSubmit={csvUpload.uploadVotersCsv}
        />

        <VoterTable
          voters={table.voters}
          allVoterCount={table.allVoterCount}
          loading={table.loading}
          currentPage={table.currentPage}
          pageSize={table.pageSize}
          onPageChange={table.setCurrentPage}
          onDeleteClick={table.openDeleteDialog}
        />
      </PageCard>

      <DeleteVoterDialog
        open={deleteDialog.open}
        onConfirm={deleteDialog.onConfirm}
        onCancel={deleteDialog.onCancel}
      />
    </>
  );
};
