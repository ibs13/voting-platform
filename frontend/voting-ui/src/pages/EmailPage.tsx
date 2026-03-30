import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

type ApiErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined;

    if (data?.message) {
      return data.message;
    }

    if (data?.errors) {
      const firstError = Object.values(data.errors)[0]?.[0];
      if (firstError) return firstError;
    }

    if (error.response?.status === 400) {
      return "Election is not active or you have already requested an OTP.";
    }

    if (error.response?.status === 401) {
      return "Unauthorized request.";
    }

    if (error.response?.status === 404) {
      return "You are not registered for this election or the election does not exist.";
    }

    if (error.response?.status === 429) {
      return "Too many requests. Please wait a moment and try again.";
    }

    if (error.response?.status === 500) {
      return "Server error. Please try again later.";
    }

    return "Something went wrong. Please try again.";
  }

  return "Unexpected error occurred.";
}

export const EmailPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { setElectionId, setEmail: setAuthEmail } = useAuth();

  // ⚠️ For now hardcode electionId (from backend dev endpoint)
  const electionId = "B98285AB-DE8D-4648-A8F1-63C4976EADC2";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post("/auth/request-otp", {
        electionId,
        email,
      });

      setElectionId(electionId);
      setAuthEmail(email);

      navigate("/otp");
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Enter Your Email
        </h2>

        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-3 rounded mb-4"
          placeholder="you@example.com"
        />

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
        <p className="pt-2 text-xs text-gray-500">
          You may request a new OTP after 30 seconds.
        </p>
      </form>
    </div>
  );
};
