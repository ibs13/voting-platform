namespace Voting.Api.Domain;

public class OtpChallenge
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ElectionId { get; set; }
    public string Email { get; set; } = "";
    public string OtpHash { get; set; } = "";
    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public DateTime? UsedAt { get; set; }

    public int Attempts { get; set; } = 0;
}
