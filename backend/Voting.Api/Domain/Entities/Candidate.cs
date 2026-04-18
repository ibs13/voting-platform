using Voting.Api.Domain.Enums;
namespace Voting.Api.Domain.Entities;

public class Candidate
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ElectionId { get; set; }
    public string FullName { get; set; } = "";
    public string? Session { get; set; }
    public string? Department { get; set; }
    public Office Office { get; set; }
    public Election? Election { get; set; }
}
