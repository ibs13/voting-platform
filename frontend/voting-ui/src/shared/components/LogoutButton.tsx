import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Button } from "@/shared/ui/Button";

export const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Button
      onClick={handleLogout}
      type="button"
      variant="danger"
      className="px-3 py-1"
    >
      Logout
    </Button>
  );
};
