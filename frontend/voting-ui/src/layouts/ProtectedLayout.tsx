import { Outlet } from "react-router-dom";
import { LogoutButton } from "../components/LogoutButton";
import { useAuth } from "../context/AuthContext";

export default function ProtectedLayout() {
  const { role } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="font-bold text-lg">
          {role === "admin" ? "Admin Panel" : "Alumni Voting System"}
        </h1>

        <LogoutButton />
      </header>

      <main className="py-10 flex justify-center">
        <Outlet />
      </main>
    </div>
  );
}
