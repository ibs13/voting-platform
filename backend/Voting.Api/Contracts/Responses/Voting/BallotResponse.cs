namespace Voting.Api.Contracts.Responses.Voting;

public record CandidateResponse(Guid Id, string FullName, string? Batch, string Office);

public record BallotResponse(
    Guid ElectionId,
    string ElectionName,
    DateTimeOffset StartAt,
    DateTimeOffset EndAt,
    List<CandidateResponse> Candidates
);