namespace Voting.Api.Dtos;

public record AdminCreateVoterDto(
    string FullName,
    string Email
);