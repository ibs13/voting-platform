import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";

type Role = "admin" | "voter";

type Props = {
  allow: Role | Role[];
  children: React.ReactNode;
};

export const RoleRoute = ({ allow, children }: Props) => {
  const { token, role, isAuthReady } = useAuth();

  if (!isAuthReady) {
    return <div className="p-10">Preparing session...</div>;
  }

  if (!token) {
    return <Navigate to="/" replace />;
  }

  const allowedRoles = Array.isArray(allow) ? allow : [allow];

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
