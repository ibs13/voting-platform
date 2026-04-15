import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, setAuthToken } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Alert } from "../components/ui/Alert";
import { FormInput } from "../components/ui/FormInput";
import { Button } from "../components/ui/Button";
import { PageCard } from "../components/ui/PageCard";
import { getUserFriendlyErrorMessage } from "../utils/getUserFriendlyErrorMessage";
import { PageShell } from "../components/ui/PageShell";

export const AdminLoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { setToken, setRole, setElectionId, setEmail } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/admin/auth/login", {
        username,
        password,
      });

      const token = res.data.token;

      setToken(token);
      setRole("admin");
      setElectionId(null);
      setEmail(null);
      setAuthToken(token);

      navigate("/admin/dashboard");
    } catch (err: unknown) {
      setError(getUserFriendlyErrorMessage(err, "adminLogin"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell centered>
      <PageCard title="Admin Login" className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            type="text"
            label="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />

          <FormInput
            type="password"
            label="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />

          {error && <Alert type="error">{error}</Alert>}

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </PageCard>
    </PageShell>
  );
};
