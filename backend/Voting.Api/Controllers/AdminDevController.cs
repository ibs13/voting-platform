using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Voting.Api.Data;

namespace Voting.Api.Controllers;

[ApiController]
[Route("admin-dev")]
public class AdminDevController : ControllerBase
{
    private readonly AppDbContext _db;

    public AdminDevController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost("close/{electionId:guid}")]
    public async Task<IActionResult> CloseElection(Guid electionId)
    {
        var election = await _db.Elections.FirstOrDefaultAsync(e => e.Id == electionId);
        if (election is null) return NotFound();

        election.Status = "Closed";
        await _db.SaveChangesAsync();

        return Ok(new { message = "Election closed." });
    }

    [HttpPost("open/{electionId:guid}")]
    public async Task<IActionResult> OpenElection(Guid electionId)
    {
        var election = await _db.Elections
            .FirstOrDefaultAsync(e => e.Id == electionId);

        if (election is null)
            return NotFound();

        election.Status = "Open";
        await _db.SaveChangesAsync();

        return Ok(new { message = "Election reopened." });
    }
}