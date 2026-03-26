import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleRoute({
  children,
  allow,
}: {
  children: React.ReactNode;
  allow: "admin" | "voter";
}) {
  const { token, role } = useAuth();

  if (!token) return <Navigate to="/" replace />;

  // role may be null for a moment while /auth/me loads
  if (!role) return <div className="p-10">Loading...</div>;

  if (role !== allow) return <Navigate to="/" replace />;

  return <>{children}</>;
}
