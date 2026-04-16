using Voting.Api.Domain.Enums;
namespace Voting.Api.Contracts.Requests.Admin;

public record AdminCreateCandidateRequest(
    string FullName,
    string? Batch,
    Office Office
);