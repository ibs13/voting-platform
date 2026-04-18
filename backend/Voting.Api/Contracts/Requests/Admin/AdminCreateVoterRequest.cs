namespace Voting.Api.Contracts.Requests.Admin;

public record AdminCreateVoterRequest(
    string Name,
    string Email,
    string Session,
    string Department
);