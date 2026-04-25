import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useEffect, useState } from "react";
import { api } from "@/shared/api/axios";
import { Alert } from "@/shared/ui/Alert";
import { getUserFriendlyErrorMessage } from "@/shared/utils/getUserFriendlyErrorMessage";
import { Button } from "@/shared/ui/Button";
import { FormSelect } from "@/shared/ui/FormSelect";
import { PageShell } from "@/shared/ui/PageShell";

type Candidate = {
  id: string;
  fullName: string;
  session?: string;
  office: string;
};

export const BallotPage = () => {
  const navigate = useNavigate();
  const { electionId, token, isAuthReady } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [formerror, setFormError] = useState<string | null>(null);

  const [president, setPresident] = useState("");
  const [secretary, setSecretary] = useState("");
  const [treasurer, setTreasurer] = useState("");

  useEffect(() => {
    if (!isAuthReady) return;

    if (!electionId || !token) {
      setLoading(false);
      setPageError("Session expired or not ready. Please log in again.");
      return;
    }

    const fetchBallot = async () => {
      try {
        // Check vote status
        const statusRes = await api.get(`/votes/status/${electionId}`);

        if (statusRes.data.hasVoted) {
          navigate("/success");
          return;
        }

        const res = await api.get(`/elections/${electionId}/ballot`);
        setCandidates(res.data.candidates);
      } catch (err) {
        setPageError(getUserFriendlyErrorMessage(err, "ballotLoad"));
      } finally {
        setLoading(false);
      }
    };

    fetchBallot();
  }, [isAuthReady, electionId, token, navigate]);

  if (!isAuthReady) {
    return (
      <PageShell centered className="px-4">
        <Alert type="info">Checking session... Please wait.</Alert>
      </PageShell>
    );
  }

  if (loading) {
    return (
      <PageShell centered className="px-4">
        <Alert type="info">Loading ballot...</Alert>
      </PageShell>
    );
  }

  if (pageError) {
    return (
      <PageShell centered className="px-4">
        <Alert type="error">{pageError}</Alert>
      </PageShell>
    );
  }

  const presidents = candidates.filter((c) => c.office === "President");
  const secretaries = candidates.filter((c) => c.office === "Secretary");
  const treasurers = candidates.filter((c) => c.office === "Treasurer");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!president || !secretary || !treasurer) {
      setFormError("Please select a candidate for all three positions.");
      return;
    }

    if (
      president === secretary ||
      president === treasurer ||
      secretary === treasurer
    ) {
      setFormError("Please select three different candidates.");
      return;
    }

    setSubmitting(true);

    try {
      await api.post("/votes/submit", {
        electionId,
        presidentCandidateId: president,
        secretaryCandidateId: secretary,
        treasurerCandidateId: treasurer,
      });

      navigate("/success");
    } catch (err) {
      setFormError(getUserFriendlyErrorMessage(err, "ballotSubmit"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* <PageShell className="px-4 py-6 sm:py-10"> */}
      <PageShell>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded shadow-md w-full  md:w-[600px] mx-auto"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            Cast Your Vote
          </h2>

          {formerror && (
            <div className="mb-4">
              <Alert type="error">{formerror}</Alert>
            </div>
          )}

          {/* President */}
          <div className="mb-6">
            <FormSelect
              label="President"
              value={president}
              onChange={(e) => {
                setPresident(e.target.value);
                setFormError(null);
              }}
            >
              <option value="">Select candidate</option>
              {presidents.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName} {c.session ? `(${c.session})` : ""}
                </option>
              ))}
            </FormSelect>
          </div>

          {/* Secretary */}
          <div className="mb-6">
            <FormSelect
              label="Secretary"
              value={secretary}
              onChange={(e) => {
                setSecretary(e.target.value);
                setFormError(null);
              }}
            >
              <option value="">Select candidate</option>
              {secretaries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName} {c.session ? `(${c.session})` : ""}
                </option>
              ))}
            </FormSelect>
          </div>

          {/* Treasurer */}
          <div className="mb-6">
            <FormSelect
              label="Treasurer"
              value={treasurer}
              onChange={(e) => {
                setTreasurer(e.target.value);
                setFormError(null);
              }}
              className="w-full border p-2 rounded mt-2"
            >
              <option value="">Select candidate</option>
              {treasurers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName} {c.session ? `(${c.session})` : ""}
                </option>
              ))}
            </FormSelect>
          </div>

          <Button
            type="submit"
            variant="success"
            fullWidth
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Vote"}
          </Button>
        </form>
      </PageShell>
    </>
  );
};
