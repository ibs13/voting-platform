import { Button } from "@/shared/ui/Button";
import { DataTable } from "@/shared/ui/DataTable";
import { Pagination } from "@/shared/ui/Pagination";
import { SectionCard } from "@/shared/ui/SectionCard";
import type { Candidate } from "../types/candidateTypes";

type CandidateTableProps = {
  candidates: Candidate[];
  allCandidateCount: number;
  loading: boolean;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onDeleteClick: (candidateId: string) => void;
};

export const CandidateTable = ({
  candidates,
  allCandidateCount,
  loading,
  currentPage,
  pageSize,
  onPageChange,
  onDeleteClick,
}: CandidateTableProps) => {
  const candidateColumns = [
    {
      key: "fullName",
      header: "Full Name",
      render: (candidate: Candidate) => candidate.fullName,
    },
    {
      key: "session",
      header: "Session",
      render: (candidate: Candidate) => candidate.session || "-",
    },
    {
      key: "department",
      header: "Department",
      render: (candidate: Candidate) => candidate.department || "-",
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
          onClick={() => onDeleteClick(candidate.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <SectionCard title="Candidate List" className="space-y-4">
      <DataTable
        columns={candidateColumns}
        data={candidates}
        keyField="id"
        loading={loading}
        loadingText="Loading candidates..."
        emptyMessage="No candidates found."
      />

      <Pagination
        currentPage={currentPage}
        totalItems={allCandidateCount}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    </SectionCard>
  );
};
