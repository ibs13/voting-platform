namespace Voting.Api.Contracts.Responses.Voting;

public record CandidateResponse(Guid Id, string FullName, string? Session, string Office);

public record BallotResponse(
    Guid ElectionId,
    string ElectionName,
    DateTimeOffset StartAt,
    DateTimeOffset EndAt,
    List<CandidateResponse> Candidates
);