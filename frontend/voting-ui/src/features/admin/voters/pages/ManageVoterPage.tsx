import { useEffect, useState, useCallback } from "react";
import { api } from "../shared/api/axios";
import { useParams } from "react-router-dom";
import { Alert } from "../shared/ui/Alert";
import { FormInput } from "../shared/ui/FormInput";
import { FormFileInput } from "../shared/ui/FormFileInput";
import { Button } from "../shared/ui/Button";
import { PageCard } from "../shared/ui/PageCard";
import { SectionCard } from "../shared/ui/SectionCard";
import { DataTable } from "../shared/ui/DataTable";
import { ConfirmDialog } from "../shared/ui/ConfirmDialog";
import { getUserFriendlyErrorMessage } from "../shared/utils/getUserFriendlyErrorMessage";

type Voter = {
  id: string;
  email: string;
  isEligible: boolean;
};

export const ManageVoterPage = () => {
  const { electionId } = useParams<{ electionId: string }>();

  const [voterEmail, setVoterEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [voterFile, setVoterFile] = useState<File | null>(null);

  const [voters, setVoters] = useState<Voter[]>([]);
  const [loadingVoters, setLoadingVoters] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVoterId, setSelectedVoterId] = useState<string | null>(null);

  const clearFeedback = () => {
    setMessage(null);
    setError(null);
  };

  const loadVoters = async (selectedElectionId: string) => {
    if (!selectedElectionId) {
      setVoters([]);
      return;
    }

    try {
      setLoadingVoters(true);
      const res = await api.get(
        `/admin/elections/${selectedElectionId}/voters`,
      );
      setVoters(res.data as Voter[]);
    } catch (err: unknown) {
      setError(getUserFriendlyErrorMessage(err, "loadVoters"));
      setVoters([]);
    } finally {
      setLoadingVoters(false);
    }
  };

  const loadLists = useCallback(async (selectedElectionId: string) => {
    await Promise.all([loadVoters(selectedElectionId)]);
  }, []);

  useEffect(() => {
    if (!electionId) {
      setVoters([]);
      return;
    }

    loadLists(electionId);
  }, [electionId, loadLists]);

  const handleAddVoter = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();

    if (!electionId) {
      setError("Please select an election first.");
      return;
    }

    try {
      await api.post(`/admin/elections/${electionId}/voters`, {
        email: voterEmail,
      });

      setMessage("Voter added successfully.");
      setVoterEmail("");
      await loadVoters(electionId);
    } catch (err: unknown) {
      setError(getUserFriendlyErrorMessage(err, "addVoter"));
    }
  };

  const handleUploadVotersCsv = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();

    if (!electionId) {
      setError("Please select an election first.");
      return;
    }

    if (!voterFile) {
      setError("Please choose a voter CSV file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", voterFile);

      const res = await api.post(
        `/admin/elections/${electionId}/voters/upload`,
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
      setVoterFile(null);
      await loadVoters(electionId);
    } catch (err: unknown) {
      setError(getUserFriendlyErrorMessage(err, "uploadVoters"));
    }
  };

  const askDeleteVoter = (voterId: string) => {
    setSelectedVoterId(voterId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDeleteVoter = async () => {
    if (!selectedVoterId) return;

    clearFeedback();

    try {
      const res = await api.delete(
        `/admin/elections/voters/${selectedVoterId}`,
      );
      setMessage(res.data?.message ?? "Voter deleted successfully.");
      setIsDeleteDialogOpen(false);
      setSelectedVoterId(null);
      await loadVoters(electionId!);
    } catch (err: unknown) {
      setError(getUserFriendlyErrorMessage(err, "deleteVoter"));
    }
  };

  const handleCancelDeleteVoter = () => {
    setIsDeleteDialogOpen(false);
    setSelectedVoterId(null);
  };

  const voterColumns = [
    {
      key: "email",
      header: "Email",
      render: (voter: Voter) => voter.email,
    },
    {
      key: "isEligible",
      header: "Eligible",
      render: (voter: Voter) => (voter.isEligible ? "Yes" : "No"),
    },
    {
      key: "actions",
      header: "Actions",
      render: (voter: Voter) => (
        <Button
          type="button"
          variant="danger"
          className="px-3 py-1 text-sm"
          onClick={() => askDeleteVoter(voter.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  if (error === "This election could not be found.") {
    return (
      <PageCard title="Manage Voters" className="max-w-5xl">
        <Alert type="error">
          Election not found. Please select a valid election.
        </Alert>
      </PageCard>
    );
  }

  return (
    <>
      <PageCard title="Manage Voters" className="max-w-5xl space-y-8">
        {message && <Alert type="success">{message}</Alert>}
        {error && <Alert type="error">{error}</Alert>}

        <SectionCard title="Add Voter" className="space-y-4">
          <form onSubmit={handleAddVoter} className="grid gap-3">
            <FormInput
              type="email"
              label="Voter Email"
              placeholder="Voter email"
              value={voterEmail}
              onChange={(e) => setVoterEmail(e.target.value)}
              required
            />

            <Button type="submit" variant="purple" className="w-fit">
              Add Voter
            </Button>
          </form>
        </SectionCard>

        <SectionCard title="Upload Voters CSV" className="space-y-4">
          <form onSubmit={handleUploadVotersCsv} className="grid gap-3">
            <FormFileInput
              label="Voter CSV File"
              accept=".csv"
              onChange={(e) => setVoterFile(e.target.files?.[0] || null)}
            />

            <Button type="submit" variant="pink" className="w-fit">
              Upload Voters CSV
            </Button>
          </form>
        </SectionCard>

        <SectionCard title="Voter List" className="space-y-4">
          <DataTable
            columns={voterColumns}
            data={voters}
            keyField="id"
            loading={loadingVoters}
            loadingText="Loading voters..."
            emptyMessage="No voters found."
          />
        </SectionCard>
      </PageCard>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Delete Voter"
        message="Are you sure you want to delete this voter?"
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleConfirmDeleteVoter}
        onCancel={handleCancelDeleteVoter}
      />
    </>
  );
};
