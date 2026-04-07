using Voting.Api.Domain.Enums;
namespace Voting.Api.Dtos;

public record AdminCreateCandidateDto(
    string FullName,
    string? Batch,
    Office Office
);