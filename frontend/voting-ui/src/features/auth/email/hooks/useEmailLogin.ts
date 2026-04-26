import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { getUserFriendlyErrorMessage } from "@/shared/utils/getUserFriendlyErrorMessage";
import { emailLoginApi } from "@/features/auth/email/api/emailLoginApi";
import type { ActiveElectionResponse } from "@/features/auth/email/types/emailLoginTypes";

type EmailPageStatus = "loading" | "ready" | "error";

export const useEmailLogin = () => {
  const navigate = useNavigate();
  const { setElectionId, setEmail: setAuthEmail } = useAuth();

  const [email, setEmail] = useState("");
  const [activeElection, setActiveElection] =
    useState<ActiveElectionResponse | null>(null);

  const [status, setStatus] = useState<EmailPageStatus>("loading");
  const [pageError, setPageError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadActiveElection = useCallback(async () => {
    try {
      setStatus("loading");
      setPageError(null);

      const election = await emailLoginApi.getActiveElection();

      setActiveElection(election);
      setElectionId(election.id);
      setStatus("ready");
    } catch (err: unknown) {
      setPageError(getUserFriendlyErrorMessage(err, "emailRequestOtp"));
      setStatus("error");
    }
  }, [setElectionId]);

  useEffect(() => {
    loadActiveElection();
  }, [loadActiveElection]);

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!activeElection) {
      setFormError("No active election is available right now.");
      return;
    }

    if (!trimmedEmail) {
      setFormError("Please enter your email address.");
      return;
    }

    try {
      setSubmitting(true);
      setFormError(null);

      await emailLoginApi.requestOtp({
        email: trimmedEmail,
      });

      setElectionId(activeElection.id);
      setAuthEmail(trimmedEmail);

      navigate("/otp");
    } catch (err: unknown) {
      setFormError(getUserFriendlyErrorMessage(err, "emailRequestOtp"));
    } finally {
      setSubmitting(false);
    }
  };

  return {
    status,
    pageError,
    email,
    activeElection,
    formError,
    submitting,
    setEmail,
    requestOtp,
  };
};
