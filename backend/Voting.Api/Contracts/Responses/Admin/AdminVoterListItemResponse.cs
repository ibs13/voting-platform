namespace Voting.Api.Contracts.Responses.Admin;

public sealed class AdminVoterListItemResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string Session { get; set; } = "";
    public string Department { get; set; } = "";
    public bool IsEligible { get; set; }
}