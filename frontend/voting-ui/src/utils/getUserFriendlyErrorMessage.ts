import axios from "axios";

type ApiErrorResponse = {
  message?: string;
  title?: string;
  errors?: Record<string, string[] | string>;
};

export type ErrorContext =
  | "adminLogin"
  | "emailRequestOtp"
  | "otpVerify"
  | "ballotLoad"
  | "ballotSubmit"
  | "loadElections"
  | "createElection"
  | "deleteElection"
  | "openElection"
  | "closeElection"
  | "loadTurnout"
  | "loadCandidates"
  | "addCandidate"
  | "uploadCandidates"
  | "deleteCandidate"
  | "loadVoters"
  | "addVoter"
  | "uploadVoters"
  | "deleteVoter"
  | "generic";

function getFirstValidationMessage(
  errors?: Record<string, string[] | string>,
): string | null {
  if (!errors) return null;

  for (const value of Object.values(errors)) {
    if (Array.isArray(value) && value.length > 0) {
      return value[0];
    }

    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return null;
}

export function getUserFriendlyErrorMessage(
  error: unknown,
  context: ErrorContext = "generic",
): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as ApiErrorResponse | string | undefined;

    if (!error.response) {
      return "Unable to connect to the server. Please check your internet connection and try again.";
    }

    if (typeof data === "string" && data.trim()) {
      return data;
    }

    if (data && typeof data === "object") {
      const validationMessage = getFirstValidationMessage(data.errors);
      if (validationMessage) return validationMessage;

      if (typeof data.message === "string" && data.message.trim()) {
        return data.message;
      }

      if (typeof data.title === "string" && data.title.trim()) {
        return data.title;
      }
    }

    switch (context) {
      case "adminLogin":
        if (status === 400) {
          return "Please enter both username and password.";
        }
        if (status === 401) {
          return "Invalid username or password.";
        }
        if (status === 403) {
          return "You do not have permission to access the admin area.";
        }
        if (status === 429) {
          return "Too many login attempts. Please wait a moment and try again.";
        }
        if (status === 500) {
          return "The server could not complete the login request. Please try again shortly.";
        }
        return "Login failed. Please try again.";

      case "emailRequestOtp":
        if (status === 400) {
          return "You cannot request an OTP right now. The election may not be active, or you may have already requested a code.";
        }
        if (status === 401) {
          return "This email address is not allowed to vote in this election.";
        }
        if (status === 404) {
          return "No active election was found, or your email is not registered for this election.";
        }
        if (status === 429) {
          return "You requested a code too recently. Please wait a moment and try again.";
        }
        if (status === 500) {
          return "We could not send the OTP right now. Please try again later.";
        }
        return "Failed to send OTP. Please try again.";

      case "otpVerify":
        if (status === 400) {
          return "The OTP you entered is not valid. Please check the code and try again.";
        }
        if (status === 401) {
          return "Your OTP is invalid or has expired. Please request a new code.";
        }
        if (status === 404) {
          return "Your verification session could not be found. Please go back and request a new OTP.";
        }
        if (status === 429) {
          return "Too many verification attempts. Please wait a little and try again.";
        }
        if (status === 500) {
          return "We could not verify your OTP right now. Please try again later.";
        }
        return "OTP verification failed. Please try again.";

      case "ballotLoad":
        if (status === 401) {
          return "Your session has expired. Please log in again to continue voting.";
        }
        if (status === 403) {
          return "Voting is not available right now for this election.";
        }
        if (status === 404) {
          return "The ballot could not be found for this election.";
        }
        if (status === 500) {
          return "We could not load the ballot right now. Please refresh and try again.";
        }
        return "Failed to load the ballot. Please try again.";

      case "ballotSubmit":
        if (status === 400) {
          return "Your vote could not be submitted. Please review your selections and try again.";
        }
        if (status === 401) {
          return "Your session has expired. Please log in again before submitting your vote.";
        }
        if (status === 403) {
          return "Voting is not allowed at the moment for this election.";
        }
        if (status === 409) {
          return "Your vote was already submitted.";
        }
        if (status === 500) {
          return "We could not submit your vote right now. Please try again.";
        }
        return "Vote submission failed. Please try again.";

      case "loadElections":
        return "Could not load elections right now.";

      case "createElection":
        if (status === 400) {
          return "Please check the election name and dates, then try again.";
        }
        return "Could not create the election.";

      case "deleteElection":
        if (status === 409) {
          return "This election cannot be deleted because it is already in use.";
        }
        return "Could not delete the election.";

      case "openElection":
        if (status === 400) {
          return "This election cannot be opened right now. Please check its status and schedule.";
        }
        return "Could not open the election.";

      case "closeElection":
        if (status === 400) {
          return "This election cannot be closed right now.";
        }
        return "Could not close the election.";

      case "loadTurnout":
        return "Could not load turnout information right now.";

      case "loadCandidates":
        return "Could not load candidates right now.";

      case "addCandidate":
        if (status === 400) {
          return "Please check the candidate details and try again.";
        }
        if (status === 409) {
          return "This candidate already exists for the selected election.";
        }
        return "Could not add the candidate.";

      case "uploadCandidates":
        if (status === 400) {
          return "The candidate CSV file is invalid. Please check the format and try again.";
        }
        return "Could not upload the candidate CSV.";

      case "deleteCandidate":
        return "Could not delete the candidate.";

      case "loadVoters":
        return "Could not load voters right now.";

      case "addVoter":
        if (status === 400) {
          return "Please enter a valid voter email address.";
        }
        if (status === 409) {
          return "This voter is already registered for the selected election.";
        }
        return "Could not add the voter.";

      case "uploadVoters":
        if (status === 400) {
          return "The voter CSV file is invalid. Please check the format and try again.";
        }
        return "Could not upload the voter CSV.";

      case "deleteVoter":
        return "Could not delete the voter.";

      default:
        if (status === 400) return "Please check your input and try again.";
        if (status === 401)
          return "You are not authorized to perform this action.";
        if (status === 403)
          return "You do not have permission to perform this action.";
        if (status === 404) return "The requested resource could not be found.";
        if (status === 409) {
          return "This action could not be completed because of a conflict.";
        }
        if (status === 429) {
          return "Too many requests. Please wait a moment and try again.";
        }
        if (status === 500) {
          return "A server error occurred. Please try again later.";
        }
        return "Something went wrong. Please try again.";
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "Something unexpected happened. Please try again.";
}
