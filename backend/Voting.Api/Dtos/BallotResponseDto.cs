namespace Voting.Api.Dtos;

public record CandidateDto(Guid Id, string FullName, string? Batch);

public record BallotResponseDto(
    Guid ElectionId,
    string ElectionName,
    DateTimeOffset StartAt,
    DateTimeOffset EndAt,
    List<CandidateDto> Candidates
);