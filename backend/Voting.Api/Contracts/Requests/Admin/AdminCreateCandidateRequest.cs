using Voting.Api.Domain.Enums;

namespace Voting.Api.Contracts.Requests.Admin;

public record AdminCreateCandidateRequest(
    string FullName,
    string? Session,
    string? Department,
    Office Office
);