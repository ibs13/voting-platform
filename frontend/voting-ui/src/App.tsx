import { Route, Routes } from "react-router-dom";
import { EmailPage } from "./pages/EmailPage";
import { OtpPage } from "./pages/OtpPage";
import { BallotPage } from "./pages/BallotPage";
import { SuccessPage } from "./pages/SuccessPage";
import { ResultsPage } from "./pages/ResultsPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ProtectedLayout from "./layouts/ProtectedLayout";
import RoleRoute from "./components/RoleRoute";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<EmailPage />} />
      <Route path="/otp" element={<OtpPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />

      <Route
        element={
          <RoleRoute allow="voter">
            <ProtectedLayout />
          </RoleRoute>
        }
      >
        <Route path="/ballot" element={<BallotPage />} />
        <Route path="/success" element={<SuccessPage />} />
      </Route>

      <Route
        element={
          <RoleRoute allow="admin">
            <ProtectedLayout />
          </RoleRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      </Route>

      <Route
        element={
          <RoleRoute allow={["admin", "voter"]}>
            <ProtectedLayout />
          </RoleRoute>
        }
      >
        <Route path="/results/:electionId" element={<ResultsPage />} />
      </Route>
    </Routes>
  );
};

export default App;
