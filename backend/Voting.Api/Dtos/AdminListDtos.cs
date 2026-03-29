namespace VotingPlatform.Api.Dtos;

public sealed class AdminCandidateDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = "";
    public string? Batch { get; set; }
    public DateTime CreatedAtUtc { get; set; }
}

public sealed class AdminVoterDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = "";
    public bool HasVoted { get; set; }
    public DateTime CreatedAtUtc { get; set; }
}