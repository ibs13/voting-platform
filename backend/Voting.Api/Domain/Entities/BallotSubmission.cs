namespace Voting.Api.Domain.Entities;

public class BallotSubmission
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ElectionId { get; set; }
    public DateTimeOffset CastAt { get; set; } = DateTimeOffset.UtcNow;
}
