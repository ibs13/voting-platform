namespace Voting.Api.Dtos;

public record VoteSubmitDto(
    Guid ElectionId,
    Guid PresidentCandidateId,
    Guid SecretaryCandidateId,
    Guid TreasurerCandidateId
);