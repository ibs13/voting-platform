import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Role = "admin" | "voter";

type Props = {
  allow: Role | Role[];
  children: React.ReactNode;
};

export default function RoleRoute({ allow, children }: Props) {
  const { token, role } = useAuth();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (!role) {
    return <div className="p-10">Loading...</div>;
  }

  const allowedRoles = Array.isArray(allow) ? allow : [allow];

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
