namespace Voting.Api.Dtos;

public record AdminCreateElectionDto(
    string Name,
    DateTime StartAt,
    DateTime EndAt
);