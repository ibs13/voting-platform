import { useParams } from "react-router-dom";
import { BackButton } from "@/shared/ui/BackButton";
import { PageCard } from "@/shared/ui/PageCard";
import { PageFeedback } from "@/shared/ui/PageFeedback";
import { AddCandidateForm } from "@/features/admin/candidates/components/AddCandidateForm";
import { CandidateTable } from "@/features/admin/candidates/components/CandidateTable";
import { DeleteCandidateDialog } from "@/features/admin/candidates/components/DeleteCandidateDialog";
import { UploadCandidatesCsvForm } from "@/features/admin/candidates/components/UploadCandidatesCsvForm";
import { useManageCandidates } from "@/features/admin/candidates/hooks/useManageCandidates";

export const ManageCandidatePage = () => {
  const { electionId } = useParams<{ electionId: string }>();

  const { form, csvUpload, feedback, table, deleteDialog } =
    useManageCandidates(electionId);

  if (feedback.error === "This election could not be found.") {
    return (
      <PageCard title="Manage Candidates" className="max-w-5xl">
        <BackButton to="/admin/dashboard" label="Back to Dashboard" />

        <PageFeedback error="Election not found. Please select a valid election." />
      </PageCard>
    );
  }

  return (
    <>
      <PageCard title="Manage Candidates" className="max-w-5xl space-y-8">
        <BackButton to="/admin/dashboard" label="Back to Dashboard" />

        <PageFeedback message={feedback.message} error={feedback.error} />

        <AddCandidateForm
          fullName={form.candidateName}
          session={form.candidateSession}
          department={form.candidateDepartment}
          office={form.candidateOffice}
          onFullNameChange={form.setCandidateName}
          onSessionChange={form.setCandidateSession}
          onDepartmentChange={form.setCandidateDepartment}
          onOfficeChange={form.setCandidateOffice}
          onSubmit={form.createCandidate}
        />

        <UploadCandidatesCsvForm
          onFileChange={csvUpload.setCandidateFile}
          onSubmit={csvUpload.uploadCandidatesCsv}
        />

        <CandidateTable
          candidates={table.candidates}
          allCandidateCount={table.allCandidateCount}
          loading={table.loading}
          currentPage={table.currentPage}
          pageSize={table.pageSize}
          onPageChange={table.setCurrentPage}
          onDeleteClick={table.openDeleteDialog}
        />
      </PageCard>

      <DeleteCandidateDialog
        open={deleteDialog.open}
        onConfirm={deleteDialog.onConfirm}
        onCancel={deleteDialog.onCancel}
      />
    </>
  );
};
