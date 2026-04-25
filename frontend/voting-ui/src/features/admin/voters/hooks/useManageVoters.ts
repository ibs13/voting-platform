import { useCallback, useEffect, useState } from "react";
import { usePagination } from "@/shared/hooks/usePagination";
import { getUserFriendlyErrorMessage } from "@/shared/utils/getUserFriendlyErrorMessage";
import { voterApi } from "@/features/admin/voters/api/voterApi";
import type { Voter } from "@/features/admin/voters/types/voterTypes";

export const useManageVoters = (electionId?: string) => {
  const [voters, setVoters] = useState<Voter[]>([]);

  const [voterName, setVoterName] = useState("");
  const [voterEmail, setVoterEmail] = useState("");
  const [voterSession, setVoterSession] = useState("");
  const [voterDepartment, setVoterDepartment] = useState("");

  const [voterFile, setVoterFile] = useState<File | null>(null);

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [loadingVoters, setLoadingVoters] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVoterId, setSelectedVoterId] = useState<string | null>(null);

  const {
    currentPage,
    setCurrentPage,
    paginatedItems: paginatedVoters,
    resetPage,
    pageSize,
  } = usePagination(voters, 10);

  const clearFeedback = () => {
    setMessage(null);
    setError(null);
  };

  const loadVoters = useCallback(async () => {
    if (!electionId) {
      setVoters([]);
      return;
    }

    try {
      setLoadingVoters(true);

      const loadedVoters = await voterApi.getByElection(electionId);

      setVoters(loadedVoters);
      resetPage();
    } catch (err: unknown) {
      setError(getUserFriendlyErrorMessage(err, "loadVoters"));
      setVoters([]);
    } finally {
      setLoadingVoters(false);
    }
  }, [electionId, resetPage]);

  useEffect(() => {
    loadVoters();
  }, []);

  const createVoter = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();

    if (!electionId) {
      setError("Please select an election first.");
      return;
    }

    try {
      await voterApi.create(electionId, {
        name: voterName,
        email: voterEmail,
        session: voterSession,
        department: voterDepartment,
      });

      setMessage("Voter added successfully.");
      setVoterName("");
      setVoterEmail("");
      setVoterSession("");
      setVoterDepartment("");

      await loadVoters();
    } catch (err: unknown) {
      setError(getUserFriendlyErrorMessage(err, "addVoter"));
    }
  };

  const uploadVotersCsv = async (e: React.FormEvent) => {
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
      const response = await voterApi.uploadCsv(electionId, voterFile);

      setMessage(
        `${response.message} Imported: ${response.imported}, Skipped: ${response.skipped}`,
      );

      setVoterFile(null);

      await loadVoters();
    } catch (err: unknown) {
      setError(getUserFriendlyErrorMessage(err, "uploadVoters"));
    }
  };

  const openDeleteDialog = (voterId: string) => {
    setSelectedVoterId(voterId);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedVoterId(null);
  };

  const confirmDeleteVoter = async () => {
    if (!selectedVoterId) return;

    clearFeedback();

    try {
      const response = await voterApi.delete(selectedVoterId);

      setMessage(response?.message ?? "Voter deleted successfully.");
      closeDeleteDialog();

      await loadVoters();
    } catch (err: unknown) {
      setError(getUserFriendlyErrorMessage(err, "deleteVoter"));
    }
  };

  return {
    form: {
      voterName,
      voterEmail,
      voterSession,
      voterDepartment,
      setVoterName,
      setVoterEmail,
      setVoterSession,
      setVoterDepartment,
      createVoter,
    },

    csvUpload: {
      setVoterFile,
      uploadVotersCsv,
    },

    feedback: {
      message,
      error,
    },

    table: {
      voters: paginatedVoters,
      allVoterCount: voters.length,
      loading: loadingVoters,
      currentPage,
      pageSize,
      setCurrentPage,
      openDeleteDialog,
    },

    deleteDialog: {
      open: isDeleteDialogOpen,
      onConfirm: confirmDeleteVoter,
      onCancel: closeDeleteDialog,
    },
  };
};
