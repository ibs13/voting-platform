import { Button } from "@/shared/ui/Button";
import { DataTable } from "@/shared/ui/DataTable";
import { Pagination } from "@/shared/ui/Pagination";
import { SectionCard } from "@/shared/ui/SectionCard";
import type { Voter } from "../types/voterTypes";

type VoterTableProps = {
  voters: Voter[];
  allVoterCount: number;
  loading: boolean;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onDeleteClick: (voterId: string) => void;
};

export const VoterTable = ({
  voters,
  allVoterCount,
  loading,
  currentPage,
  pageSize,
  onPageChange,
  onDeleteClick,
}: VoterTableProps) => {
  const voterColumns = [
    {
      key: "name",
      header: "Name",
      render: (voter: Voter) => voter.name,
    },
    {
      key: "email",
      header: "Email",
      render: (voter: Voter) => voter.email,
    },
    {
      key: "session",
      header: "Session",
      render: (voter: Voter) => voter.session,
    },
    {
      key: "department",
      header: "Department",
      render: (voter: Voter) => voter.department,
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
          onClick={() => onDeleteClick(voter.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <SectionCard title="Voter List" className="space-y-4">
      <DataTable
        columns={voterColumns}
        data={voters}
        keyField="id"
        loading={loading}
        loadingText="Loading voters..."
        emptyMessage="No voters found."
      />

      <Pagination
        currentPage={currentPage}
        totalItems={allVoterCount}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    </SectionCard>
  );
};
