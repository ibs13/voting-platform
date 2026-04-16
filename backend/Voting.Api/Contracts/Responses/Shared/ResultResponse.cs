namespace Voting.Api.Contracts.Responses.Shared;

public record OfficeResultResponse(
    string Office,
    List<CandidateResultResponse> Results,
    List<Guid> WinnerCandidateIds,
    bool IsTie
);

public record CandidateResultResponse(
    Guid CandidateId,
    string FullName,
    int VoteCount
);

public record ElectionResultsResponse(
    Guid ElectionId,
    string ElectionName,
    int TotalEligibleVoters,
    int TotalVotesCast,
    List<OfficeResultResponse> Offices
);