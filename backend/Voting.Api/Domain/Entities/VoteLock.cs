namespace Voting.Api.Domain.Entities;

public class VoteLock
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ElectionId { get; set; }
    public Guid VoterId { get; set; }
    public DateTime LockedAt { get; set; } = DateTime.UtcNow;
}
