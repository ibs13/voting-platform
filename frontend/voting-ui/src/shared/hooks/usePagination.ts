import { useMemo, useState } from "react";

export const usePagination = <T>(items: T[], pageSize = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  }, [items, currentPage, pageSize]);

  const resetPage = () => setCurrentPage(1);

  return {
    currentPage,
    setCurrentPage,
    paginatedItems,
    resetPage,
    pageSize,
  };
};
