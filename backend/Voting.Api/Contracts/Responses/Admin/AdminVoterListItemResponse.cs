namespace Voting.Api.Contracts.Responses.Admin;

public sealed class AdminVoterListItemResponse
{
    public Guid Id { get; set; }
    public string Email { get; set; } = "";
    public bool IsEligible { get; set; }
}