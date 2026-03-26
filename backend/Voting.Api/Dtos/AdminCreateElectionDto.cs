namespace Voting.Api.Dtos;

public record AdminCreateElectionDto(
    string Name,
    DateTimeOffset StartAt,
    DateTimeOffset EndAt
);