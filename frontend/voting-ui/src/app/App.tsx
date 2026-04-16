import { Route, Routes } from "react-router-dom";
import { EmailPage } from "../features/auth/pages/EmailPage";
import { OtpPage } from "../features/auth/pages/OtpPage";
import { BallotPage } from "../features/voter/ballot/pages/BallotPage";
import { SuccessPage } from "../features/voter/success/pages/SuccessPage";
import { ResultsPage } from "../pages/ResultsPage";
import { AdminLoginPage } from "../features/auth/pages/AdminLoginPage";
import { AdminDashboardPage } from "../pages/AdminDashboardPage";
import { ProtectedLayout } from "../layouts/ProtectedLayout";
import { RoleRoute } from "./routes/RoleRoute";
import { ManageCandidatePage } from "../pages/ManageCandidatePage";
import { ManageVoterPage } from "../pages/ManageVoterPage";
import { ManageElectionPage } from "../pages/ManageElectionPage";

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
        <Route
          path="/admin/manage-elections"
          element={<ManageElectionPage />}
        />
        <Route
          path="/admin/manage-candidates/:electionId"
          element={<ManageCandidatePage />}
        />
        <Route
          path="/admin/manage-voters/:electionId"
          element={<ManageVoterPage />}
        />
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
