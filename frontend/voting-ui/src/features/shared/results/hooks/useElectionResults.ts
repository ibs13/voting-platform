import { useCallback, useEffect, useState } from "react";
import { AxiosError } from "axios";
import { resultApi } from "@/features/shared/results/api/resultApi";
import type { ResultsResponse } from "@/features/shared/results/types/resultTypes";

type ResultStatus = "loading" | "ready" | "error";

const getResultErrorMessage = (err: unknown) => {
  if (err instanceof AxiosError) {
    if (err.response?.status === 403) {
      return "This election is still open. Results will be available after the election is closed.";
    }

    if (err.response?.status === 404) {
      return "Election not found.";
    }

    if (err.response?.status === 401) {
      return "You need to log in to view results.";
    }

    if (typeof err.response?.data === "string") {
      return err.response.data;
    }

    return "Failed to load results.";
  }

  if (err instanceof Error) {
    return err.message;
  }

  return "Failed to load results.";
};

export const useElectionResults = (electionId?: string) => {
  const [result, setResult] = useState<ResultsResponse | null>(null);
  const [status, setStatus] = useState<ResultStatus>("loading");
  const [error, setError] = useState<string | null>(null);

  const loadResults = useCallback(async () => {
    if (!electionId) {
      setError("Election id is missing.");
      setStatus("error");
      return;
    }

    try {
      setStatus("loading");
      setError(null);

      const loadedResult = await resultApi.getByElection(electionId);

      setResult(loadedResult);
      setStatus("ready");
    } catch (err: unknown) {
      setError(getResultErrorMessage(err));
      setStatus("error");
    }
  }, [electionId]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void loadResults();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [loadResults]);

  return {
    result,
    status,
    error,
    reloadResults: loadResults,
  };
};
