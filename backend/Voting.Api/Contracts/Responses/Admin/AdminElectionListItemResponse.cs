namespace Voting.Api.Contracts.Responses.Admin;

public sealed class AdminElectionListItemResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = "";
    public string Status { get; set; } = "";
    public DateTime StartAt { get; set; }
    public DateTime EndAt { get; set; }
}