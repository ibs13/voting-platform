using Voting.Api.Domain.Enums;
namespace Voting.Api.Domain.Entities;

public class Election
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = "";
    public DateTime StartAt { get; set; }
    public DateTime EndAt { get; set; }
    public ElectionStatus Status { get; set; } = ElectionStatus.Draft;

    public List<Candidate> Candidates { get; set; } = [];
    public List<Voter> Voters { get; set; } = [];
}
