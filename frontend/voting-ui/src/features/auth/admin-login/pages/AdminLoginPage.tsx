import { PageShell } from "@/shared/ui/PageShell";
import { AdminLoginForm } from "@/features/auth/admin-login/components/AdminLoginForm";
import { useAdminLogin } from "@/features/auth/admin-login/hooks/useAdminLogin";

export const AdminLoginPage = () => {
  const {
    username,
    password,
    error,
    loading,
    setUsername,
    setPassword,
    submitAdminLogin,
  } = useAdminLogin();

  return (
    <PageShell centered className="px-4">
      <AdminLoginForm
        username={username}
        password={password}
        error={error}
        loading={loading}
        onUsernameChange={setUsername}
        onPasswordChange={setPassword}
        onSubmit={submitAdminLogin}
      />
    </PageShell>
  );
};
