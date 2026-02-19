import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { useAuth } from "../context/AuthContext";

export const OtpPage = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { electionId, email, setToken } = useAuth();

  if (!electionId || !email) {
    return <div className="p-10">Invalid session. Go back.</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/auth/verify-otp", {
        electionId,
        email,
        otp,
      });

      const token = response.data.token;
      setToken(token);

      navigate("/ballot");
    } catch (err: any) {
      setError(err.response?.data || "Invalid OTP");
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
        <h2 className="text-2xl font-bold mb-6 text-center">Enter OTP</h2>

        <input
          type="text"
          required
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border p-3 rounded mb-4"
          placeholder="6-digit code"
        />

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
};
