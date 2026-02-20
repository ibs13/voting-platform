import { Route, Routes } from "react-router-dom";
import { EmailPage } from "./pages/EmailPage";
import { OtpPage } from "./pages/OtpPage";
import { BallotPage } from "./pages/BallotPage";
import { SuccessPage } from "./pages/SuccessPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<EmailPage />} />
      <Route path="/otp" element={<OtpPage />} />
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
    </Routes>
  );
};

export default App;
