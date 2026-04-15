import { useEffect, useState, useCallback } from "react";
import { api } from "../api/axios";
import { useParams } from "react-router-dom";
import { Alert } from "../components/ui/Alert";
import { FormInput } from "../components/ui/FormInput";
import { FormSelect } from "../components/ui/FormSelect";
import { FormFileInput } from "../components/ui/FormFileInput";
import { Button } from "../components/ui/Button";
import { PageCard } from "../components/ui/PageCard";
import { SectionCard } from "../components/ui/SectionCard";
import { DataTable } from "../components/ui/DataTable";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { getUserFriendlyErrorMessage } from "../utils/getUserFriendlyErrorMessage";

type Candidate = {
  id: string;
  fullName: string;
  batch: string | null;
  office: string;
};

export const ManageCandidatePage = () => {
  const { electionId } = useParams<{ electionId: string }>();

  const [candidateName, setCandidateName] = useState("");
  const [candidateBatch, setCandidateBatch] = useState("");
  const [candidateOffice, setCandidateOffice] = useState("President");

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [candidateFile, setCandidateFile] = useState<File | null>(null);

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(
    null,
  );

  const clearFeedback = () => {
    setMessage(null);
    setError(null);
  };

  const loadCandidates = async (selectedElectionId: string) => {
    if (!selectedElectionId) {
      setCandidates([]);
      return;
    }

    try {
      setLoadingCandidates(true);
      const res = await api.get(
        `/admin/elections/${selectedElectionId}/candidates`,
      );
      setCandidates(res.data as Candidate[]);
    } catch (err: unknown) {
      setError(getUserFriendlyErrorMessage(err, "loadCandidates"));
      setCandidates([]);
    } finally {
      setLoadingCandidates(false);
    }
  };

  const loadLists = useCallback(async (selectedElectionId: string) => {
    await Promise.all([loadCandidates(selectedElectionId)]);
  }, []);

  useEffect(() => {
    if (!electionId) {
      setCandidates([]);
      return;
    }

    loadLists(electionId);
  }, [electionId, loadLists]);

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();

    if (!electionId) {
      setError("Please select an election first.");
      return;
    }

    try {
      await api.post(`/admin/elections/${electionId}/candidates`, {
        fullName: candidateName,
        batch: candidateBatch.trim() || null,
        office: candidateOffice,
      });

      setMessage("Candidate added successfully.");
      setCandidateName("");
      setCandidateBatch("");
      setCandidateOffice("President");

      await loadCandidates(electionId);
    } catch (err: unknown) {
      setError(getUserFriendlyErrorMessage(err, "addCandidate"));
    }
  };

  const handleUploadCandidatesCsv = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();

    if (!electionId) {
      setError("Please select an election first.");
      return;
    }

    if (!candidateFile) {
      setError("Please choose a candidate CSV file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", candidateFile);

      const res = await api.post(
        `/admin/elections/${electionId}/candidates/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setMessage(
        `${res.data.message} Imported: ${res.data.imported}, Skipped: ${res.data.skipped}`,
      );
      setCandidateFile(null);

      await loadCandidates(electionId);
    } catch (err: unknown) {
      setError(getUserFriendlyErrorMessage(err, "uploadCandidates"));
    }
  };

  const askDeleteCandidate = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDeleteCandidate = async () => {
    if (!selectedCandidateId) return;

    clearFeedback();

    try {
      const res = await api.delete(
        `/admin/elections/candidates/${selectedCandidateId}`,
      );
      setMessage(res.data?.message ?? "Candidate deleted successfully.");
      setIsDeleteDialogOpen(false);
      setSelectedCandidateId(null);
      await loadCandidates(electionId!);
    } catch (err: unknown) {
      setError(getUserFriendlyErrorMessage(err, "deleteCandidate"));
    }
  };

  const handleCancelDeleteCandidate = () => {
    setIsDeleteDialogOpen(false);
    setSelectedCandidateId(null);
  };

  const candidateColumns = [
    {
      key: "fullName",
      header: "Full Name",
      render: (candidate: Candidate) => candidate.fullName,
    },
    {
      key: "batch",
      header: "Batch",
      render: (candidate: Candidate) => candidate.batch || "-",
    },
    {
      key: "office",
      header: "Office",
      render: (candidate: Candidate) => candidate.office,
    },
    {
      key: "actions",
      header: "Actions",
      render: (candidate: Candidate) => (
        <Button
          type="button"
          variant="danger"
          className="px-3 py-1 text-sm"
          onClick={() => askDeleteCandidate(candidate.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  if (error === "This election could not be found.") {
    return (
      <PageCard title="Manage Candidates" className="max-w-5xl">
        <Alert type="error">
          Election not found. Please select a valid election.
        </Alert>
      </PageCard>
    );
  }

  return (
    <>
      <PageCard title="Manage Candidates" className="max-w-5xl space-y-8">
        {message && <Alert type="success">{message}</Alert>}
        {error && <Alert type="error">{error}</Alert>}

        <SectionCard title="Add Candidate" className="space-y-4">
          <form onSubmit={handleAddCandidate} className="grid gap-3">
            <FormInput
              type="text"
              label="Candidate Full Name"
              placeholder="Candidate full name"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              required
            />

            <FormInput
              type="text"
              label="Batch"
              placeholder="Batch (optional)"
              value={candidateBatch}
              onChange={(e) => setCandidateBatch(e.target.value)}
            />

            <FormSelect
              label="Office"
              value={candidateOffice}
              onChange={(e) => setCandidateOffice(e.target.value)}
              required
            >
              <option value="President">President</option>
              <option value="Secretary">Secretary</option>
              <option value="Treasurer">Treasurer</option>
            </FormSelect>

            <Button type="submit" variant="success" className="w-fit">
              Add Candidate
            </Button>
          </form>
        </SectionCard>

        <SectionCard title="Upload Candidates CSV" className="space-y-4">
          <form onSubmit={handleUploadCandidatesCsv} className="grid gap-3">
            <FormFileInput
              label="Candidate CSV File"
              accept=".csv"
              onChange={(e) => setCandidateFile(e.target.files?.[0] || null)}
            />

            <Button type="submit" variant="indigo" className="w-fit">
              Upload Candidates CSV
            </Button>
          </form>
        </SectionCard>

        <SectionCard title="Candidate List" className="space-y-4">
          <DataTable
            columns={candidateColumns}
            data={candidates}
            keyField="id"
            loading={loadingCandidates}
            loadingText="Loading candidates..."
            emptyMessage="No candidates found."
          />
        </SectionCard>
      </PageCard>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Delete Candidate"
        message="Are you sure you want to delete this candidate?"
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleConfirmDeleteCandidate}
        onCancel={handleCancelDeleteCandidate}
      />
    </>
  );
};
