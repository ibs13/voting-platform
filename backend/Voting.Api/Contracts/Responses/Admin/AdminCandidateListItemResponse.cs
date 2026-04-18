namespace Voting.Api.Contracts.Responses.Admin;

public sealed class AdminCandidateListItemResponse
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = "";
    public string? Session { get; set; }
    public string? Department { get; set; }
    public string Office { get; set; } = "";
}