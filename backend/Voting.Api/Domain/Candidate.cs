namespace Voting.Api.Domain;

public class Candidate
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ElectionId { get; set; }
    public string FullName { get; set; } = "";
    public string? Batch { get; set; }
    public string? Department { get; set; }
    public string? Roll { get; set; }

    public Election? Election { get; set; }
}
