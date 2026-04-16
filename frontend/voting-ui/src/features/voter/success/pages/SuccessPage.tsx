import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const SuccessPage = () => {
  const { electionId } = useAuth();
  const navigate = useNavigate();

  const handleViewResults = () => {
    if (!electionId) return;
    navigate(`/results/${electionId}`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Vote submitted successfully</h2>
      <p className="text-gray-700">Thank you. Your vote has been recorded.</p>
      <p className="text-sm text-gray-600">
        Results will be available after the election is closed.
      </p>

      <button
        type="button"
        onClick={handleViewResults}
        className="bg-slate-700 text-white px-4 py-2 rounded hover:bg-slate-800"
      >
        View Results
      </button>
    </div>
  );
};
