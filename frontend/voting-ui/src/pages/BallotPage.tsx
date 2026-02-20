import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { api } from "../api/axios";

type Candidate = {
  id: string;
  fullName: string;
  batch?: string;
};

export const BallotPage = () => {
  const navigate = useNavigate();
  const { electionId, token } = useAuth();

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [president, setPresident] = useState("");
  const [secretary, setSecretary] = useState("");
  const [treasurer, setTreasurer] = useState("");

  useEffect(() => {
    if (!electionId || !token) return;

    const fetchBallot = async () => {
      try {
        const res = await api.get(`/elections/${electionId}/ballot`);
        setCandidates(res.data.candidates);
      } catch (err: any) {
        setError(err.response?.data || "Failed to load ballot");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBallot();
  }, [electionId, token]);

  if (loading) return <div className="p-10">Loading ballot...</div>;
  if (error) return <div className="p-10 text-red-500">{error}</div>;

  const selectIds = [president, secretary, treasurer];

  const isDisabled = (id: string) => selectIds.includes(id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!president || !secretary || !treasurer) {
      alert("Please selcet 3 different candidates.");
      return;
    }

    try {
      await api.post("/votes/submit", {
        electionId,
        presidentCandidateId: president,
        secretaryCandidateId: secretary,
        treasurerCandidateId: treasurer,
      });

      navigate("/success");
    } catch (err: any) {
      alert(err.response?.data || "Vote failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-[600px]"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Cast Your Vote</h2>

        {/* President */}

        <div className="mb-6">
          <label className="font-semibold">President</label>
          <select
            value={president}
            onChange={(e) => setPresident(e.target.value)}
            className="w-full border p-2 rounded mt-2"
          >
            <option value="">Select candidate</option>
            {candidates.map((c) => (
              <option
                key={c.id}
                value={c.id}
                disabled={c.id === secretary || c.id === treasurer}
              >
                {c.fullName} {c.batch ? `(${c.batch})` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Secretary */}
        <div className="mb-6">
          <label className="font-semibold">Secretary</label>
          <select
            value={secretary}
            onChange={(e) => setSecretary(e.target.value)}
            className="w-full border p-2 rounded mt-2"
          >
            <option value="">Select candidate</option>
            {candidates.map((c) => (
              <option
                key={c.id}
                value={c.id}
                disabled={c.id === president || c.id === treasurer}
              >
                {c.fullName} {c.batch ? `(${c.batch})` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Treasurer */}
        <div className="mb-6">
          <label className="font-semibold">Treasurer</label>
          <select
            value={treasurer}
            onChange={(e) => setTreasurer(e.target.value)}
            className="w-full border p-2 rounded mt-2"
          >
            <option value="">Select candidate</option>
            {candidates.map((c) => (
              <option
                key={c.id}
                value={c.id}
                disabled={c.id === president || c.id === secretary}
              >
                {c.fullName} {c.batch ? `(${c.batch})` : ""}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
        >
          Submit Vote
        </button>
      </form>
    </div>
  );
};
