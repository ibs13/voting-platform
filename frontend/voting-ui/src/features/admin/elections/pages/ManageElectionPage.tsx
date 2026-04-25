import { useEffect, useState } from "react";
import { api } from "@/shared/api/axios";
import { Alert } from "@/shared/ui/Alert";
import { FormInput } from "@/shared/ui/FormInput";
import { Button } from "@/shared/ui/Button";
import { BackButton } from "@/shared/ui/BackButton";
import { PageCard } from "@/shared/ui/PageCard";
import { SectionCard } from "@/shared/ui/SectionCard";
import { DataTable } from "@/shared/ui/DataTable";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";
import { getUserFriendlyErrorMessage } from "@/shared/utils/getUserFriendlyErrorMessage";
import { Pagination } from "@/shared/ui/Pagination";
import { usePagination } from "@/shared/hooks/usePagination";

type Election = {
  id: string;
  name: string;
  status: string;
  startAt: string;
  endAt: string;
};

export const ManageElectionPage = () => {
  const [elections, setElections] = useState<Election[]>([]);

  const [name, setName] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingElections, setLoadingElections] = useState(true);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedElectionId, setSelectedElectionId] = useState<string | null>(
    null,
  );

  const {
    currentPage,
    setCurrentPage,
    paginatedItems: paginatedElections,
    resetPage,
    pageSize,
  } = usePagination(elections, 10);

  const clearFeedback = () => {
    setMessage(null);
    setError(null);
  };

  const loadElections = async () => {
    try {
      setLoadingElections(true);
      const res = await api.get("/admin/elections");
      const loadedElections: Election[] = res.data;
      setElections(loadedElections);
      resetPage();
    } catch (err: unknown) {
      setError(getUserFriendlyErrorMessage(err, "loadElections"));
    } finally {
      setLoadingElections(false);
    }
  };

  useEffect(() => {
    loadElections();
  }, []);

  const handleCreateElection = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();

    try {
      const res = await api.post("/admin/elections", {
        name,
        startAt,
        endAt,
      });

      setMessage(`Election created: ${res.data.name}`);
      setName("");
      setStartAt("");
      setEndAt("");

      await loadElections();
    } catch (err: unknown) {
      setError(getUserFriendlyErrorMessage(err, "createElection"));
    }
  };

  const askDeleteElection = (electionId: string) => {
    setSelectedElectionId(electionId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDeleteElection = async () => {
    if (!selectedElectionId) return;

    clearFeedback();

    try {
      const res = await api.delete(`/admin/elections/${selectedElectionId}`);
      setMessage(res.data?.message ?? "Election deleted successfully.");
      setIsDeleteDialogOpen(false);
      setSelectedElectionId(null);
      await loadElections();
    } catch (err: unknown) {
      setError(getUserFriendlyErrorMessage(err, "deleteElection"));
    }
  };

  const handleCancelDeleteElection = () => {
    setIsDeleteDialogOpen(false);
    setSelectedElectionId(null);
  };

  const electionColumns = [
    {
      key: "name",
      header: "Name",
      render: (election: Election) => election.name,
    },
    {
      key: "status",
      header: "Status",
      render: (election: Election) => <StatusBadge status={election.status} />,
    },
    {
      key: "startAt",
      header: "Start Time",
      render: (election: Election) =>
        election.startAt ? new Date(election.startAt).toLocaleString() : "N/A",
    },
    {
      key: "endAt",
      header: "End Time",
      render: (election: Election) =>
        election.endAt ? new Date(election.endAt).toLocaleString() : "N/A",
    },
    {
      key: "action",
      header: "Action",
      render: (election: Election) => (
        <Button
          type="button"
          variant="danger"
          className="px-3 py-1.5 text-sm"
          onClick={() => askDeleteElection(election.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageCard title="Manage Elections" className="max-w-5xl space-y-8">
        <BackButton to="/admin/dashboard" label="Back to Dashboard" />
        {message && <Alert type="success">{message}</Alert>}
        {error && <Alert type="error">{error}</Alert>}

        <SectionCard title="Create Election" className="space-y-4">
          <form onSubmit={handleCreateElection} className="grid gap-3">
            <FormInput
              type="text"
              label="Election Name"
              placeholder="Election name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <FormInput
              type="datetime-local"
              label="Start Time"
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
              required
            />

            <FormInput
              type="datetime-local"
              label="End Time"
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
              required
            />

            <Button type="submit" className="w-fit">
              Create Election
            </Button>
          </form>
        </SectionCard>

        <SectionCard title="Election List" className="space-y-4">
          <DataTable
            columns={electionColumns}
            data={paginatedElections}
            keyField="id"
            loading={loadingElections}
            loadingText="Loading elections..."
            emptyMessage="No elections found."
          />

          <Pagination
            currentPage={currentPage}
            totalItems={elections.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </SectionCard>
      </PageCard>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Delete Election"
        message="Are you sure you want to delete this election?"
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleConfirmDeleteElection}
        onCancel={handleCancelDeleteElection}
      />
    </>
  );
};
