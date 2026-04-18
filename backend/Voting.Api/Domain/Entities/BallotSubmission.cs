namespace Voting.Api.Domain.Entities;

public class BallotSubmission
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ElectionId { get; set; }
    public DateTime CastAt { get; set; } = DateTime.UtcNow;
}
