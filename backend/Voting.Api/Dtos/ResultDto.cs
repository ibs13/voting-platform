namespace Voting.Api.Dtos;

public record OfficeResultDto(
    string Office,
    List<CandidateResultDto> Results,
    List<Guid> WinnerCandidateIds,
    bool IsTie
);

public record CandidateResultDto(
    Guid CandidateId,
    string FullName,
    int VoteCount
);

public record ElectionResultsDto(
    Guid ElectionId,
    string ElectionName,
    int TotalEligibleVoters,
    int TotalVotesCast,
    List<OfficeResultDto> Offices
);