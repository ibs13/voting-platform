namespace Voting.Api.Contracts.Responses.Admin;

public sealed class AdminCandidateListItemResponse
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = "";
    public string? Batch { get; set; }
    public string Office { get; set; } = "";
}