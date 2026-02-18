using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Voting.Api.Data;
using Voting.Api.Domain;
using Voting.Api.Domain.Enums;
using Voting.Api.Dtos;
using Voting.Api.Services;

namespace Voting.Api.Controllers;

[ApiController]
[Route("votes")]
public class VotesController : ControllerBase
{
    private readonly AppDbContext _db;

    public VotesController(AppDbContext db)
    {
        _db = db;
    }

    [Authorize(Roles = "voter")]
    [HttpPost("submit")]
    public async Task<IActionResult> Submit([FromBody] VoteSubmitDto dto)
    {
        // Ensure token election matches payload election
         var tokenElectionId = UserClaims.GetElectionId(User);
        if (tokenElectionId != dto.ElectionId) return Forbid();

        var email = UserClaims.GetEmail(User);

        // Validate distinct candidates (must be 3 different persons)
        if (dto.PresidentCandidateId == dto.SecretaryCandidateId ||
            dto.PresidentCandidateId == dto.TreasurerCandidateId ||
            dto.SecretaryCandidateId == dto.TreasurerCandidateId)
        {
            return BadRequest("You must choose 3 different people for 3 positions.");
        }

        var election = await _db.Elections.FirstOrDefaultAsync(e => e.Id == dto.ElectionId);
        if (election is null) return NotFound("Election not found.");

        var now = DateTimeOffset.UtcNow;
        if (election.Status != "Open") return BadRequest("Election is not open.");
        if (now < election.StartAt || now > election.EndAt) return BadRequest("Election is not active.");

        // voter must be eligible
        var voter = await _db.Voters.FirstOrDefaultAsync(v =>
            v.ElectionId == dto.ElectionId && v.Email == email && v.IsEligible);

        if (voter is null) return BadRequest("You are not eligible for this election.");

        // Validate candidate ids belong to election
        var candidateIds = new[] { dto.PresidentCandidateId, dto.SecretaryCandidateId, dto.TreasurerCandidateId };

        var validCount = await _db.Candidates
            .Where(c => c.ElectionId == dto.ElectionId && candidateIds.Contains(c.Id))
            .CountAsync();

        if (validCount != 3) return BadRequest("Invalid candidate selection.");

        // Transaction: lock voter + store anonymous votes
        await using var tx = await _db.Database.BeginTransactionAsync();

        try
        {
            // 1) VoteLock (prevents voting twice)
            _db.VoteLocks.Add(new VoteLock
            {
                ElectionId = dto.ElectionId,
                VoterId = voter.Id,
                LockedAt = DateTimeOffset.UtcNow
            });

            // 2) Create submission group
            var submission = new BallotSubmission
            {
                ElectionId = dto.ElectionId,
                CastAt = DateTimeOffset.UtcNow
            };
            _db.BallotSubmissions.Add(submission);

            // 3) Insert votes (anonymous)
            _db.Votes.AddRange(
                new Vote
                {
                    ElectionId = dto.ElectionId,
                    BallotSubmissionId = submission.Id,
                    Office = Office.President,
                    CandidateId = dto.PresidentCandidateId,
                    CastAt = DateTimeOffset.UtcNow
                },
                new Vote
                {
                    ElectionId = dto.ElectionId,
                    BallotSubmissionId = submission.Id,
                    Office = Office.Secretary,
                    CandidateId = dto.SecretaryCandidateId,
                    CastAt = DateTimeOffset.UtcNow
                },
                new Vote
                {
                    ElectionId = dto.ElectionId,
                    BallotSubmissionId = submission.Id,
                    Office = Office.Treasurer,
                    CandidateId = dto.TreasurerCandidateId,
                    CastAt = DateTimeOffset.UtcNow
                }
            );

            await _db.SaveChangesAsync();
            await tx.CommitAsync();

            return Ok(new { message = "Vote recorded successfully." });
        }
        catch (DbUpdateException)
        {
            await tx.RollbackAsync();
            // Most likely: voter already voted, or DB constraints violated
            return Conflict("You have already voted or your ballot was invalid.");
        }
    }
}