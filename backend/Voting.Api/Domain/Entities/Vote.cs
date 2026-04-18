using Voting.Api.Domain.Enums;

namespace Voting.Api.Domain.Entities;

public class Vote
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ElectionId { get; set; }
    public Guid BallotSubmissionId { get; set; }
    public Office Office { get; set; }
    public Guid CandidateId { get; set; }
    public DateTime CastAt { get; set; } = DateTime.UtcNow;
}
