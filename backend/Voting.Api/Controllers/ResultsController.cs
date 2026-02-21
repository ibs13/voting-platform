using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Voting.Api.Data;
using Voting.Api.Domain;
using Voting.Api.Domain.Enums;
using Voting.Api.Dtos;

namespace Voting.Api.Controllers;

[ApiController]
[Route("results")]

public class ResultsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ResultsController(AppDbContext db)
    {
        _db = db;
    }

    // For now: any authenticated user can view
    [Authorize]
    [HttpGet("{electionId:guid}")]

    public async Task<IActionResult> GetResults(Guid electionId)
    {
        var election = await _db.Elections
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == electionId);

        if (election is null)
            return NotFound("Election not found.");

        if (election.Status != "Closed"){
            return Forbid("Results are not available until the election is closed.");
        }

        // Turnout
        var totalEligible = await _db.Voters
            .CountAsync(v => v.ElectionId == electionId && v.IsEligible);
        
        var totalVoted = await _db.VoteLocks
            .CountAsync(vl => vl.ElectionId == electionId);

        var Offices = new List<OfficeResultDto>();

        foreach(var office in Enum.GetValues<Office>())
        {
            var voteGroups = await _db.Votes
                .Where(v => v.ElectionId == electionId && v.Office == office)
                .GroupBy(v => v.CandidateId)
                .Select(g => new
                {
                    CandidateId = g.Key,
                    VoteCount = g.Count()
                })
                .ToListAsync();

            var candidates = await _db.Candidates
                .Where(c => c.ElectionId == electionId)
                .ToDictionaryAsync(c => c.Id, c => c.FullName);
            
            var results = voteGroups
                .Select(g => new CandidateResultDto(
                    g.CandidateId,
                    candidates.ContainsKey(g.CandidateId)
                        ? candidates[g.CandidateId]
                        : "Unknown",
                    g.VoteCount
                ))
                .OrderByDescending(r => r.VoteCount)
                .ToList();

            var maxVotes = results.Any() ? results.Max(r => r.VoteCount) : 0;

            var winners = results
                .Where(r => r.VoteCount == maxVotes && maxVotes > 0)
                .Select(r => r.CandidateId)
                .ToList();

            var isTie = winners.Count > 1;

            Offices.Add(new OfficeResultDto(
                office.ToString(),
                results,
                winners,
                isTie
            ));
        }

        return Ok(new ElectionResultsDto(
            election.Id,
            election.Name,
            totalEligible,
            totalVoted,
            Offices
        ));
    }
}