import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/Button";

type BackButtonProps = {
  to?: string;
  label?: string;
};

export const BackButton = ({ to, label = "Back" }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      navigate(to);
      return;
    }

    navigate(-1);
  };

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={handleBack}
      className="w-fit text-sm mb-4"
    >
      ← {label}
    </Button>
  );
};
