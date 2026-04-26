import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { getUserFriendlyErrorMessage } from "@/shared/utils/getUserFriendlyErrorMessage";
import { otpApi } from "@/features/auth/otp/api/otpApi";

export const useOtpVerification = () => {
  const navigate = useNavigate();
  const { electionId, email, setToken, setRole } = useAuth();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSessionExpired = !electionId || !email;

  const backToEmailLogin = () => {
    navigate("/");
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!electionId || !email) {
      setError("Session expired. Please request a new OTP.");
      return;
    }

    const trimmedOtp = otp.trim();

    if (!trimmedOtp) {
      setError("Please enter the OTP.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await otpApi.verifyOtp({
        electionId,
        email,
        otp: trimmedOtp,
      });

      setToken(response.token);
      setRole("voter");

      navigate("/ballot");
    } catch (err: unknown) {
      setError(getUserFriendlyErrorMessage(err, "otpVerify"));
    } finally {
      setLoading(false);
    }
  };

  return {
    otp,
    email,
    error,
    loading,
    isSessionExpired,
    setOtp,
    verifyOtp,
    backToEmailLogin,
  };
};
