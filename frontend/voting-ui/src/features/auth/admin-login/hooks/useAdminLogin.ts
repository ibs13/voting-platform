import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { getUserFriendlyErrorMessage } from "@/shared/utils/getUserFriendlyErrorMessage";
import { adminLoginApi } from "@/features/auth/admin-login/api/adminLoginApi";

export const useAdminLogin = () => {
  const navigate = useNavigate();
  const { setToken, setRole, setElectionId, setEmail } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedUsername = username.trim();

    if (!trimmedUsername || !password) {
      setError("Please enter both username and password.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await adminLoginApi.login({
        username: trimmedUsername,
        password,
      });

      setToken(response.token);
      setRole("admin");

      // Admin is not tied to voter election/email context
      setElectionId(null);
      setEmail(null);

      navigate("/admin/dashboard");
    } catch (err: unknown) {
      setError(getUserFriendlyErrorMessage(err, "adminLogin"));
    } finally {
      setLoading(false);
    }
  };

  return {
    username,
    password,
    error,
    loading,
    setUsername,
    setPassword,
    submitAdminLogin,
  };
};
