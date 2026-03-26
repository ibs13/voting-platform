namespace Voting.Api.Dtos;

public record AdminCreateCandidateDto(
    string FullName,
    string? Batch
);