namespace Voting.Api.Contracts.Requests.Admin;

public record AdminCreateElectionRequest(
    string Name,
    DateTime StartAt,
    DateTime EndAt
);