import { Route, Routes } from "react-router-dom";
import { EmailPage } from "./pages/EmailPage";
import { OtpPage } from "./pages/OtpPage";
import { BallotPage } from "./pages/BallotPage";
import { SuccessPage } from "./pages/SuccessPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ResultsPage } from "./pages/ResultsPage";
import ProtectedLayout from "./layouts/ProtectedLayout";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<EmailPage />} />
      <Route path="/otp" element={<OtpPage />} />

      <Route
        element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/ballot"
          element={
            <ProtectedRoute>
              <BallotPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/success"
          element={
            <ProtectedRoute>
              <SuccessPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/results"
          element={
            <ProtectedRoute>
              <ResultsPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;
