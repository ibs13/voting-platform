using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Voting.Api.Data;

namespace Voting.Api.Controllers;

[ApiController]
[Route("admin/elections")]
[Authorize(Roles = "admin")]
public class AdminElectionsController : ControllerBase
{
    private readonly AppDbContext _db;

    public AdminElectionsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost("{electionId:guid}/open")]
    public async Task<IActionResult> Open(Guid electionId)
    {
        var e = await _db.Elections.FirstOrDefaultAsync(x => x.Id == electionId);
        if (e is null) return NotFound();

        e.Status = "Open";
        await _db.SaveChangesAsync();
        return Ok(new { message = "Election opened." });
    }

    [HttpPost("{electionId:guid}/close")]
    public async Task<IActionResult> Close(Guid electionId)
    {
        var e = await _db.Elections.FirstOrDefaultAsync(x => x.Id == electionId);
        if (e is null) return NotFound();

        e.Status = "Closed";
        await _db.SaveChangesAsync();
        return Ok(new { message = "Election closed." });
    }

    [HttpGet("{electionId:guid}/turnout")]
    public async Task<IActionResult> Turnout(Guid electionId)
    {
        var eligible = await _db.Voters.CountAsync(v => v.ElectionId == electionId && v.IsEligible);
        var voted = await _db.VoteLocks.CountAsync(vl => vl.ElectionId == electionId);

        return Ok(new { eligible, voted });
    }
}