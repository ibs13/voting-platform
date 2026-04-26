import { PageShell } from "@/shared/ui/PageShell";
import { EmailErrorState } from "@/features/auth/email/components/EmailErrorState";
import { EmailLoadingState } from "@/features/auth/email/components/EmailLoadingState";
import { EmailLoginForm } from "@/features/auth/email/components/EmailLoginForm";
import { useEmailLogin } from "@/features/auth/email/hooks/useEmailLogin";

export const EmailPage = () => {
  const {
    status,
    pageError,
    email,
    activeElection,
    formError,
    submitting,
    setEmail,
    requestOtp,
  } = useEmailLogin();

  if (status === "loading") {
    return <EmailLoadingState />;
  }

  if (status === "error") {
    return (
      <EmailErrorState
        message={pageError ?? "Election is not available right now."}
      />
    );
  }

  return (
    <PageShell centered className="px-4">
      <EmailLoginForm
        email={email}
        activeElection={activeElection}
        error={formError}
        loading={submitting}
        onEmailChange={setEmail}
        onSubmit={requestOtp}
      />
    </PageShell>
  );
};
