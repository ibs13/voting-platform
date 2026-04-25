import { useEffect, useState } from "react";
import { usePagination } from "@/shared/hooks/usePagination";
import { getUserFriendlyErrorMessage } from "@/shared/utils/getUserFriendlyErrorMessage";
import { electionApi } from "@/features/admin/elections/api/elcetionApi";
import type { Election } from "@/features/admin/elections/types/electionTypes";

export const useManageElections = () => {
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

      const loadedElections = await electionApi.getAll();

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

  const createElection = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();

    try {
      const createdElection = await electionApi.create({
        name,
        startAt,
        endAt,
      });

      setMessage(`Election created: ${createdElection.name}`);
      setName("");
      setStartAt("");
      setEndAt("");

      await loadElections();
    } catch (err: unknown) {
      setError(getUserFriendlyErrorMessage(err, "createElection"));
    }
  };

  const openDeleteDialog = (electionId: string) => {
    setSelectedElectionId(electionId);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedElectionId(null);
  };

  const confirmDeleteElection = async () => {
    if (!selectedElectionId) return;

    clearFeedback();

    try {
      const response = await electionApi.delete(selectedElectionId);

      setMessage(response?.message ?? "Election deleted successfully.");
      closeDeleteDialog();

      await loadElections();
    } catch (err: unknown) {
      setError(getUserFriendlyErrorMessage(err, "deleteElection"));
    }
  };

  return {
    form: {
      name,
      startAt,
      endAt,
      setName,
      setStartAt,
      setEndAt,
      createElection,
    },

    feedback: {
      message,
      error,
    },

    table: {
      elections: paginatedElections,
      allElectionCount: elections.length,
      loading: loadingElections,
      currentPage,
      pageSize,
      setCurrentPage,
      openDeleteDialog,
    },

    deleteDialog: {
      open: isDeleteDialogOpen,
      onConfirm: confirmDeleteElection,
      onCancel: closeDeleteDialog,
    },
  };
};
