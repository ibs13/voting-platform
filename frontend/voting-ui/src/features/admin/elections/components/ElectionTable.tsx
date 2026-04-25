import { Button } from "@/shared/ui/Button";
import { DataTable } from "@/shared/ui/DataTable";
import { Pagination } from "@/shared/ui/Pagination";
import { SectionCard } from "@/shared/ui/SectionCard";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import type { Election } from "../types/electionTypes";

type ElectionTableProps = {
  elections: Election[];
  allElectionCount: number;
  loading: boolean;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onDeleteClick: (electionId: string) => void;
};

export const ElectionTable = ({
  elections,
  allElectionCount,
  loading,
  currentPage,
  pageSize,
  onPageChange,
  onDeleteClick,
}: ElectionTableProps) => {
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
          onClick={() => onDeleteClick(election.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <SectionCard title="Election List" className="space-y-4">
      <DataTable
        columns={electionColumns}
        data={elections}
        keyField="id"
        loading={loading}
        loadingText="Loading elections..."
        emptyMessage="No elections found."
      />

      <Pagination
        currentPage={currentPage}
        totalItems={allElectionCount}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    </SectionCard>
  );
};
