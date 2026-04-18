namespace Voting.Api.Domain.Entities;

public class Voter
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ElectionId { get; set; }
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string Session { get; set; } = "";
    public string Department { get; set; } = "";
    public bool IsEligible { get; set; } = true;

    public Election? Election { get; set; }
}
