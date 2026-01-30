namespace Voting.Api.Domain;

public class Voter
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ElectionId { get; set; }
    public string Email { get; set; } = "";
    public string Batch { get; set; } = "";
    public string Department { get; set; } = "";
    public string Roll { get; set; } = "";
    public bool IsEligible { get; set; } = true;

    public Election? Election { get; set; }
}
