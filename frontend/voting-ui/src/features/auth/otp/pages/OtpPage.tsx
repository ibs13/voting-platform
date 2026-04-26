import { PageShell } from "@/shared/ui/PageShell";
import { OtpSessionExpiredState } from "../components/OtpSessionExpiredState";
import { OtpVerificationForm } from "../components/OtpVerificationForm";
import { useOtpVerification } from "../hooks/useOtpVerification";

export const OtpPage = () => {
  const {
    otp,
    email,
    error,
    loading,
    isSessionExpired,
    setOtp,
    verifyOtp,
    backToEmailLogin,
  } = useOtpVerification();

  if (isSessionExpired || !email) {
    return <OtpSessionExpiredState onBackToEmail={backToEmailLogin} />;
  }

  return (
    <PageShell centered className="px-4">
      <OtpVerificationForm
        email={email}
        otp={otp}
        error={error}
        loading={loading}
        onOtpChange={setOtp}
        onSubmit={verifyOtp}
      />
    </PageShell>
  );
};
