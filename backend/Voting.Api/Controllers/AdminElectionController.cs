using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Voting.Api.Data;
using Voting.Api.Domain;
using Voting.Api.Domain.Enums;
using Voting.Api.Dtos;
using Voting.Api.Services;
using Voting.Api.Helpers;

namespace Voting.Api.Controllers;

[ApiController]
[Route("admin/elections")]
[Authorize(Roles = "admin")]
public class AdminElectionsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly CsvImportService _csv;

    public AdminElectionsController(AppDbContext db, CsvImportService csv)
    {
        _db = db;
        _csv = csv;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] AdminCreateElectionDto dto)
    {

        var startAtUtc = TimeZoneHelper.ConvertBangladeshLocalToUtc(dto.StartAt);
        var endAtUtc = TimeZoneHelper.ConvertBangladeshLocalToUtc(dto.EndAt);

        if (string.IsNullOrWhiteSpace(dto.Name))
            return BadRequest("Election name is required.");

        if (startAtUtc < DateTime.UtcNow)
            return BadRequest("Start time must be in the future.");

        if (endAtUtc < startAtUtc)
            return BadRequest("End time must be after start time.");

        var election = new Election
        {
            Name = dto.Name.Trim(),
            StartAt = startAtUtc,
            EndAt = endAtUtc,
            Status = "Draft"
        };

        _db.Elections.Add(election);
        await _db.SaveChangesAsync();

        return Ok(new
        {
            election.Id,
            election.Name,
            election.Status,
            StartAtUtc = election.StartAt,
            EndAtUtc = election.EndAt,                                                                                                                                                     
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
            Batch = string.IsNullOrWhiteSpace(dto.Batch) ? null : dto.Batch.Trim(),
            Office = dto.Office
        };

        _db.Candidates.Add(candidate);
        await _db.SaveChangesAsync();

        return Ok(new
        {
            candidate.Id,
            candidate.ElectionId,
            candidate.FullName,
            candidate.Batch,
            Office = candidate.Office.ToString()
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
                c.Batch,
                Office = c.Office.ToString()
            })
            .ToListAsync();

        return Ok(candidates);
    }

    [HttpDelete("candidates/{candidateId:guid}")]
    public async Task<IActionResult> DeleteCandidate(Guid candidateId)
    {
        var candidate = await _db.Candidates
            .FirstOrDefaultAsync(c => c.Id == candidateId);

        if (candidate is null)
            return NotFound("Candidate not found.");

        var hasVotes = await _db.Votes.AnyAsync(v =>
            v.CandidateId == candidateId);

        if (hasVotes)
            return BadRequest("Cannot delete candidate because votes already exist for this candidate.");

        _db.Candidates.Remove(candidate);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Candidate deleted successfully." });
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
                // v.CreatedAtUtc
            })
            .ToListAsync();

        return Ok(voters);
    }

    [HttpDelete("voters/{voterId:guid}")]
    public async Task<IActionResult> DeleteVoter(Guid voterId)
    {
        var voter = await _db.Voters
            .FirstOrDefaultAsync(v => v.Id == voterId);

        if (voter is null)
            return NotFound("Voter not found.");

        var hasVoteLock = await _db.VoteLocks.AnyAsync(vl => vl.VoterId == voterId);

        if (hasVoteLock)
            return BadRequest("Cannot delete voter because this voter has already voted.");

        _db.Voters.Remove(voter);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Voter deleted successfully." });
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

    [HttpPost("{electionId:guid}/voters/upload")]
    public async Task<IActionResult> UploadVoters(Guid electionId, IFormFile file)
    {
        var electionExists = await _db.Elections.AnyAsync(e => e.Id == electionId);
        if (!electionExists) return NotFound("Election not found.");

        if (file is null || file.Length == 0)
            return BadRequest("CSV file is required.");

        var rows = _csv.ParseLines(file);

        if (rows.Count == 0)
            return BadRequest("CSV file is empty.");

        var header = rows[0];
        if (header.Length < 1 || !string.Equals(header[0], "email", StringComparison.OrdinalIgnoreCase))
            return BadRequest("Voters CSV header must be: email");

        var imported = 0;
        var skipped = 0;

        foreach (var row in rows.Skip(1))
        {
            if (row.Length < 1 || string.IsNullOrWhiteSpace(row[0]))
            {
                skipped++;
                continue;
            }

            var email = row[0].Trim().ToLowerInvariant();

            var exists = await _db.Voters.AnyAsync(v =>
                v.ElectionId == electionId && v.Email == email);

            if (exists)
            {
                skipped++;
                continue;
            }

            _db.Voters.Add(new Voter
            {
                ElectionId = electionId,
                Email = email,
                IsEligible = true
            });

            imported++;
        }

        await _db.SaveChangesAsync();

        return Ok(new
        {
            message = "Voter CSV processed successfully.",
            imported,
            skipped
        });
    }

    [HttpPost("{electionId:guid}/candidates/upload")]
    public async Task<IActionResult> UploadCandidates(Guid electionId, IFormFile file)
    {
        var electionExists = await _db.Elections.AnyAsync(e => e.Id == electionId);
        if (!electionExists) return NotFound("Election not found.");

        if (file is null || file.Length == 0)
            return BadRequest("CSV file is required.");

        var rows = _csv.ParseLines(file);

        if (rows.Count == 0)
            return BadRequest("CSV file is empty.");

        var header = rows[0];
        if (header.Length < 3
            || !string.Equals(header[0], "fullName", StringComparison.OrdinalIgnoreCase)
            || !string.Equals(header[2], "office", StringComparison.OrdinalIgnoreCase))
            return BadRequest("Candidates CSV header must be: fullName,batch,office");

        var imported = 0;
        var skipped = 0;

        foreach (var row in rows.Skip(1))
        {
            if (row.Length < 3 || string.IsNullOrWhiteSpace(row[0]) || string.IsNullOrWhiteSpace(row[2]))
            {
                skipped++;
                continue;
            }

            if (!Enum.TryParse<Office>(row[2].Trim(), ignoreCase: true, out var office))
            {
                skipped++;
                continue;
            }

            var fullName = row[0].Trim();
            var batch = !string.IsNullOrWhiteSpace(row[1]) ? row[1].Trim() : null;

            var exists = await _db.Candidates.AnyAsync(c =>
                c.ElectionId == electionId && c.FullName == fullName);

            if (exists)
            {
                skipped++;
                continue;
            }

            _db.Candidates.Add(new Candidate
            {
                ElectionId = electionId,
                FullName = fullName,
                Batch = batch,
                Office = office
            });

            imported++;
        }

        await _db.SaveChangesAsync();

        return Ok(new
        {
            message = "Candidate CSV processed successfully.",
            imported,
            skipped
        });
    }
}