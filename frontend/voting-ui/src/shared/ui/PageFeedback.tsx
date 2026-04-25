import { Alert } from "./Alert";

type PageFeedbackProps = {
  message?: string | null;
  error?: string | null;
};

export const PageFeedback = ({ message, error }: PageFeedbackProps) => {
  return (
    <>
      {message && <Alert type="success">{message}</Alert>}
      {error && <Alert type="error">{error}</Alert>}
    </>
  );
};
