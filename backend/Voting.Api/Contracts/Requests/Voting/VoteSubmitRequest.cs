namespace Voting.Api.Contracts.Requests.Voting;

public record VoteSubmitRequest(
    Guid ElectionId,
    Guid PresidentCandidateId,
    Guid SecretaryCandidateId,
    Guid TreasurerCandidateId
);