using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Voting.Api.Data;
using Voting.Api.Domain;
using Voting.Api.Dtos;

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

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] AdminCreateElectionDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            return BadRequest("Election name is required.");

        if (dto.EndAt <= dto.StartAt)
            return BadRequest("End time must be after start time.");

        var election = new Election
        {
            Name = dto.Name.Trim(),
            StartAt = dto.StartAt,
            EndAt = dto.EndAt,
            Status = "Draft"
        };

        _db.Elections.Add(election);
        await _db.SaveChangesAsync();

        return Ok(new
        {
            election.Id,
            election.Name,
            election.Status,
            election.StartAt,
            election.EndAt
        });
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var elections = await _db.Elections
            .AsNoTracking()
            .OrderByDescending(e => e.StartAt)
            .Select(e => new
            {
                e.Id,
                e.Name,
                e.Status,
                e.StartAt,
                e.EndAt
            })
            .ToListAsync();

        return Ok(elections);
    }

    [HttpPost("{electionId:guid}/candidates")]
    public async Task<IActionResult> AddCandidate(Guid electionId, [FromBody] AdminCreateCandidateDto dto)
    {
        var election = await _db.Elections.FirstOrDefaultAsync(e => e.Id == electionId);
        if (election is null) return NotFound("Election not found.");

        if (string.IsNullOrWhiteSpace(dto.FullName))
            return BadRequest("Candidate name is required.");

        var candidate = new Candidate
        {
            ElectionId = electionId,
            FullName = dto.FullName.Trim(),
            Batch = string.IsNullOrWhiteSpace(dto.Batch) ? null : dto.Batch.Trim()
        };

        _db.Candidates.Add(candidate);
        await _db.SaveChangesAsync();

        return Ok(new
        {
            candidate.Id,
            candidate.ElectionId,
            candidate.FullName,
            candidate.Batch
        });
    }

    [HttpGet("{electionId:guid}/candidates")]
    public async Task<IActionResult> GetCandidates(Guid electionId)
    {
        var electionExists = await _db.Elections.AnyAsync(e => e.Id == electionId);
        if (!electionExists) return NotFound("Election not found.");

        var candidates = await _db.Candidates
            .AsNoTracking()
            .Where(c => c.ElectionId == electionId)
            .OrderBy(c => c.FullName)
            .Select(c => new
            {
                c.Id,
                c.FullName,
                c.Batch
            })
            .ToListAsync();

        return Ok(candidates);
    }

    [HttpPost("{electionId:guid}/voters")]
    public async Task<IActionResult> AddVoter(Guid electionId, [FromBody] AdminCreateVoterDto dto)
    {
        var election = await _db.Elections.FirstOrDefaultAsync(e => e.Id == electionId);
        if (election is null) return NotFound("Election not found.");

        if (string.IsNullOrWhiteSpace(dto.Email))
            return BadRequest("Email is required.");

        var normalizedEmail = dto.Email.Trim().ToLowerInvariant();

        var exists = await _db.Voters.AnyAsync(v =>
            v.ElectionId == electionId && v.Email == normalizedEmail);

        if (exists)
            return Conflict("This voter already exists for the election.");

        var voter = new Voter
        {
            ElectionId = electionId,
            Email = normalizedEmail,
            IsEligible = true
        };

        _db.Voters.Add(voter);
        await _db.SaveChangesAsync();

        return Ok(new
        {
            voter.Id,
            voter.ElectionId,
            voter.Email,
            voter.IsEligible
        });
    }

    [HttpGet("{electionId:guid}/voters")]
    public async Task<IActionResult> GetVoters(Guid electionId)
    {
        var electionExists = await _db.Elections.AnyAsync(e => e.Id == electionId);
        if (!electionExists) return NotFound("Election not found.");

        var voters = await _db.Voters
            .AsNoTracking()
            .Where(v => v.ElectionId == electionId)
            .OrderBy(v => v.Email)
            .Select(v => new
            {
                v.Id,
                v.Email,
                v.IsEligible
            })
            .ToListAsync();

        return Ok(voters);
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