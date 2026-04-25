import { Button } from "@/shared/ui/Button";

type PaginationProps = {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

export const Pagination = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-gray-600">
        Showing {startItem}-{endItem} of {totalItems}
      </p>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          className="px-3 py-1 text-sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </Button>

        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>

        <Button
          type="button"
          variant="secondary"
          className="px-3 py-1 text-sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
