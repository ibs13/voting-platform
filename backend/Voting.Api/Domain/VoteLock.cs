namespace Voting.Api.Domain;

public class VoteLock
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ElectionId { get; set; }
    public Guid VoterId { get; set; }
    public DateTimeOffset LockedAt { get; set; } = DateTimeOffset.UtcNow;
}
