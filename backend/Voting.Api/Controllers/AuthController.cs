using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Voting.Api.Data;
using Voting.Api.Domain;
using Voting.Api.Dtos;
using Voting.Api.Services;

namespace Voting.Api.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IDevOtpSender _otpSender;
    private readonly JwtTokenService _jwt;

    public AuthController(AppDbContext db, IDevOtpSender otpSender, JwtTokenService jwt)
    {
        _db = db;
        _otpSender = otpSender;
        _jwt = jwt;
    }

    [HttpPost("request-otp")]
    public async Task<IActionResult> RequestOtp([FromBody] AuthRequestOtpDto dto)
    {
        var email = dto.Email.Trim().ToLowerInvariant();

        // election must exist + open + within time

        var election = await _db.Elections.FirstOrDefaultAsync(election => election.Id == dto.ElectionId);
        if (election is null) return NotFound("Election not found.");
        if (election.Status != "Open") return BadRequest("Election is not open.");
        var now = DateTimeOffset.UtcNow;
        if(now < election.StartAt || now > election.EndAt) return BadRequest("Election is not active.");

        // voter must be eligible
        var voter = await _db.Voters.FirstOrDefaultAsync(v =>
            v.ElectionId == dto.ElectionId && v.Email == email && v.IsEligible);
        if (voter is null) return BadRequest("You are not eligible for this election.");

        // generate OTP
        var otp = string.Concat(Enumerable.Range(0,6)
        .Select(_ => Random.Shared.Next(0, 10)));
        var otpHash = BCrypt.Net.BCrypt.HashPassword(otp);

        var challenge = new OtpChallenge
        {
            ElectionId = dto.ElectionId,
            Email = email,
            OtpHash = otpHash,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddMinutes(10),
            Attempts = 0
        };

        _db.OtpChallenges.Add(challenge);
        await _db.SaveChangesAsync();

        await _otpSender.SendAsync(email,otp);

        var all = await _db.OtpChallenges
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new { c.Id, c.UsedAt, c.CreatedAt, c.ExpiresAt })
            .ToListAsync();

        foreach (var item in all)
        {
            Console.WriteLine($"Id={item.Id}, UsedAt={item.UsedAt}, CreatedAt={item.CreatedAt}, ExpiresAt={item.ExpiresAt}");
        }

        return Ok(new {message ="OTP sent (dev mode prints to console)"});

    }

    [HttpPost("verify-otp")]
    public async Task<ActionResult> VerifyOtp([FromBody] AuthVerifyOtpDto dto)
    {
        var email = dto.Email.Trim().ToLowerInvariant();

        var challenge = await _db.OtpChallenges
            .Where(c => c.ElectionId == dto.ElectionId && c.Email == email)
            .OrderByDescending(c => c.CreatedAt)
            .FirstOrDefaultAsync();

        if (challenge is null) return BadRequest("No OTP request found.");
        if (challenge.UsedAt is not null) return BadRequest("OTP already used.");
        if (DateTime.UtcNow > challenge.ExpiresAt) return BadRequest("OTP expired.");
        if (challenge.Attempts >= 5) return BadRequest("Too many attempts.");

        challenge.Attempts += 1;

        

        var ok = BCrypt.Net.BCrypt.Verify(dto.Otp, challenge.OtpHash);
        if (!ok)
        {
            await _db.SaveChangesAsync();
            return BadRequest("Invalid OTP.");
        }

        challenge.UsedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        var token = _jwt.CreateVoterToken(dto.ElectionId, email);
        return Ok(new { token });
    }
}