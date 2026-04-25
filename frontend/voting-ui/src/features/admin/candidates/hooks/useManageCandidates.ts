import { useCallback, useEffect, useState } from "react";
import { usePagination } from "@/shared/hooks/usePagination";
import { getUserFriendlyErrorMessage } from "@/shared/utils/getUserFriendlyErrorMessage";
import { candidateApi } from "@/features/admin/candidates/api/candidateApi";
import type {
  Candidate,
  CandidateOffice,
} from "@/features/admin/candidates/types/candidateTypes";

export const useManageCandidates = (electionId?: string) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const [candidateName, setCandidateName] = useState("");
  const [candidateSession, setCandidateSession] = useState("");
  const [candidateDepartment, setCandidateDepartment] = useState("");
  const [candidateOffice, setCandidateOffice] =
    useState<CandidateOffice>("President");

  const [candidateFile, setCandidateFile] = useState<File | null>(null);

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [loadingCandidates, setLoadingCandidates] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(
    null,
  );

  const {
    currentPage,
    setCurrentPage,
    paginatedItems: paginatedCandidates,
    resetPage,
    pageSize,
  } = usePagination(candidates, 10);

  const clearFeedback = () => {
    setMessage(null);
    setError(null);
  };

  const loadCandidates = useCallback(async () => {
    if (!electionId) {
      setCandidates([]);
      return;
    }

    try {
      setLoadingCandidates(true);

      const loadedCandidates = await candidateApi.getByElection(electionId);

      setCandidates(loadedCandidates);
      resetPage();
    } catch (err: unknown) {
      setError(getUserFriendlyErrorMessage(err, "loadCandidates"));
      setCandidates([]);
    } finally {
      setLoadingCandidates(false);
    }
  }, [electionId, resetPage]);

  useEffect(() => {
    loadCandidates();
  }, []);

  const createCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();

    if (!electionId) {
      setError("Please select an election first.");
      return;
    }

    try {
      await candidateApi.create(electionId, {
        fullName: candidateName,
        session: candidateSession.trim() || null,
        department: candidateDepartment.trim() || null,
        office: candidateOffice,
      });

      setMessage("Candidate added successfully.");
      setCandidateName("");
      setCandidateSession("");
      setCandidateDepartment("");
      setCandidateOffice("President");

      await loadCandidates();
    } catch (err: unknown) {
      setError(getUserFriendlyErrorMessage(err, "addCandidate"));
    }
  };

  const uploadCandidatesCsv = async (e: React.FormEvent) => {
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
      const response = await candidateApi.uploadCsv(electionId, candidateFile);

      setMessage(
        `${response.message} Imported: ${response.imported}, Skipped: ${response.skipped}`,
      );

      setCandidateFile(null);

      await loadCandidates();
    } catch (err: unknown) {
      setError(getUserFriendlyErrorMessage(err, "uploadCandidates"));
    }
  };

  const openDeleteDialog = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedCandidateId(null);
  };

  const confirmDeleteCandidate = async () => {
    if (!selectedCandidateId) return;

    clearFeedback();

    try {
      const response = await candidateApi.delete(selectedCandidateId);

      setMessage(response?.message ?? "Candidate deleted successfully.");
      closeDeleteDialog();

      await loadCandidates();
    } catch (err: unknown) {
      setError(getUserFriendlyErrorMessage(err, "deleteCandidate"));
    }
  };

  return {
    form: {
      candidateName,
      candidateSession,
      candidateDepartment,
      candidateOffice,
      setCandidateName,
      setCandidateSession,
      setCandidateDepartment,
      setCandidateOffice,
      createCandidate,
    },

    csvUpload: {
      setCandidateFile,
      uploadCandidatesCsv,
    },

    feedback: {
      message,
      error,
    },

    table: {
      candidates: paginatedCandidates,
      allCandidateCount: candidates.length,
      loading: loadingCandidates,
      currentPage,
      pageSize,
      setCurrentPage,
      openDeleteDialog,
    },

    deleteDialog: {
      open: isDeleteDialogOpen,
      onConfirm: confirmDeleteCandidate,
      onCancel: closeDeleteDialog,
    },
  };
};
