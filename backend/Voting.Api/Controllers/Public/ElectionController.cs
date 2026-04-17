using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Voting.Api.Infrastructure.Data;
using Voting.Api.Contracts.Responses.Voting;
using Voting.Api.Infrastructure.Auth;
using Voting.Api.Domain.Enums;

namespace Voting.Api.Controllers.Public;

[ApiController]
[Route("elections")]
public class ElectionsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ElectionsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("active")]
    public async Task<IActionResult> GetActive()
    {
        var nowUtc = DateTime.UtcNow;

        var election = await _db.Elections
            .AsNoTracking()
            .Where(e => e.Status == ElectionStatus.Open && e.StartAt <= nowUtc && e.EndAt >= nowUtc)
            .OrderBy(e => e.StartAt)
            .FirstOrDefaultAsync();

        if (election is null)
        {
            return NotFound(new { message = "No active election found." });
        }

        return Ok(new
        {
            election.Id,
            election.Name,
            election.Status,
            election.StartAt,
            election.EndAt
        });
    }
    
    // Voter must be authenticated to view ballot
    [Authorize(Roles = "voter")]
    [HttpGet("{electionId:guid}/ballot")]
    public async Task<IActionResult> GETBallot(Guid electionId)
    {
        // Ensure token election matches request election (prevents reuse across elections)
        var tokenElectionId = UserClaims.GetElectionId(User);
        if(tokenElectionId != electionId) return Forbid();

        var email = UserClaims.GetEmail(User);

        var election = await _db.Elections.AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == electionId);

        if (election is null) return NotFound("Election not found");

        var now = DateTime.UtcNow;
        if (election.Status != ElectionStatus.Open) return BadRequest("Election is not open.");
        if (now < election.StartAt || now > election.EndAt) return BadRequest("Election is not active.");

        // return candidates

        var candidates = await _db.Candidates.AsNoTracking()
            .Where(c => c.ElectionId == electionId)
            .OrderBy(c => c.FullName)
            .Select(c => new CandidateResponse(c.Id, c.FullName, c.Batch, c.Office.ToString()))
            .ToListAsync();

        return Ok(new BallotResponse(
            election.Id,
            election.Name,
            election.StartAt,
            election.EndAt,
            candidates
        ));
    }

}