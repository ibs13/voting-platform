namespace Voting.Api.Domain;

public class Election
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = "";
    public DateTimeOffset StartAt { get; set; }
    public DateTimeOffset EndAt { get; set; }
    public string Status { get; set; } = "Draft"; // Draft/Open/Closed

    public List<Candidate> Candidates { get; set; } = [];
    public List<Voter> Voters { get; set; } = [];
}
