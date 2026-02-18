using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Voting.Api.Data;
using Voting.Api.Dtos;
using Voting.Api.Services;

namespace Voting.Api.Controllers;

[ApiController]
[Route("elections")]
public class ElectionsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ElectionsController(AppDbContext db)
    {
        _db = db;
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

        var now = DateTimeOffset.UtcNow;
        if (election.Status != "Open") return BadRequest("Election is not open.");
        if (now < election.StartAt || now > election.EndAt) return BadRequest("Election is not active.");

        // return candidates

        var candidates = await _db.Candidates.AsNoTracking()
            .Where(c => c.ElectionId == electionId)
            .OrderBy(c => c.FullName)
            .Select(c => new CandidateDto(c.Id, c.FullName, c.Batch))
            .ToListAsync();

        return Ok(new BallotResponseDto(
            election.Id,
            election.Name,
            election.StartAt,
            election.EndAt,
            candidates
        ));
    }

}