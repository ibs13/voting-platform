import { Alert } from "@/shared/ui/Alert";
import { Button } from "@/shared/ui/Button";
import { FormInput } from "@/shared/ui/FormInput";
import { PageCard } from "@/shared/ui/PageCard";

type AdminLoginFormProps = {
  username: string;
  password: string;
  error: string | null;
  loading: boolean;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export const AdminLoginForm = ({
  username,
  password,
  error,
  loading,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}: AdminLoginFormProps) => {
  return (
    <PageCard title="Admin Login" className="w-full max-w-md">
      <form onSubmit={onSubmit} className="space-y-4">
        <FormInput
          type="text"
          label="Username"
          required
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          placeholder="Username"
        />

        <FormInput
          type="password"
          label="Password"
          required
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="Password"
        />

        {error && <Alert type="error">{error}</Alert>}

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </PageCard>
  );
};
