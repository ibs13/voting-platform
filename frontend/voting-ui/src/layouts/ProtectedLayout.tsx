import { Outlet } from "react-router-dom";
import { LogoutButton } from "../components/LogoutButton";

export default function ProtectedLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="font-bold text-lg">Alumni Voting System</h1>

        <LogoutButton />
      </header>

      {/* Page Content */}
      <main className="py-10 flex justify-center">
        <Outlet />
      </main>
    </div>
  );
}
