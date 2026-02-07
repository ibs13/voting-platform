using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Voting.Api.Data;

namespace Voting.Api.Controllers;

[ApiController]
[Route("dev")]

public class DevController : ControllerBase
{
    private readonly AppDbContext _db;
    public DevController(AppDbContext db) => _db = db;

    [HttpGet("election")]
    public async Task<IActionResult> GetElection()
    {
        var e = await _db.Elections.AsNoTracking().FirstAsync();
        return Ok(new {e.Id, e.Name, e.Status, e.StartAt, e.EndAt });
    }

    [HttpGet("candidates/{electionid:guid}")]
    public async Task<IActionResult> GetCandidates(Guid electionId)
    {
        var list = await _db.Candidates.AsNoTracking()
            .Where(c => c.ElectionId == electionId)
            .Select(c =>  new { c.Id, c.FullName, c.Batch})
            .ToListAsync();

        return Ok(list);
    }
}