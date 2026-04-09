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
    private const int MaxOtpRequestsPer10Minutes = 5;
    private static readonly TimeSpan OtpRequestWindow = TimeSpan.FromMinutes(10);
    private static readonly TimeSpan OtpCooldown = TimeSpan.FromSeconds(30);

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
        var nowUtc = DateTime.UtcNow;

        var election = await _db.Elections
            .FirstOrDefaultAsync(e =>
                e.Status == "Open" &&
                e.StartAt <= nowUtc &&
                e.EndAt >= nowUtc);

        if (election is null)
        {
            return BadRequest("No active election is available right now.");
        }

        var voter = await _db.Voters.FirstOrDefaultAsync(v =>
            v.ElectionId == election.Id &&
            v.Email == email &&
            v.IsEligible);

        if (voter is null)
        {
            return BadRequest("You are not eligible for the active election.");
        }


        //  Cooldown: prevent immediate repeated requests
        var latestRequest = await _db.OtpChallenges
            .Where(c => c.ElectionId == election.Id && c.Email == email)
            .OrderByDescending(c => c.CreatedAt)
            .FirstOrDefaultAsync();

        if (latestRequest is not null && nowUtc - latestRequest.CreatedAt < OtpCooldown)
        {
            return BadRequest("Please wait before requesting another OTP.");
        }

        // Rate limit: max N requests in last 10 minutes
        var windowStart = nowUtc.Subtract(OtpRequestWindow);

        var recentRequestCount = await _db.OtpChallenges.CountAsync(c =>
            c.ElectionId == election.Id &&
            c.Email == email &&
            c.CreatedAt >= windowStart);

        if (recentRequestCount >= MaxOtpRequestsPer10Minutes)
        {
            return BadRequest("Too many OTP requests. Please try again later.");
        }

        // Invalidate any previous unused OTPs
        var activeChallenges = await _db.OtpChallenges
            .Where(c =>
                c.ElectionId == election.Id &&
                c.Email == email &&
                c.UsedAt == null &&
                c.ExpiresAt > nowUtc)
            .ToListAsync();

        foreach (var activeChallenge in activeChallenges)
        {
            activeChallenge.UsedAt = nowUtc; // mark old active OTPs unusable
        }

        // generate OTP
        var otp = string.Concat(Enumerable.Range(0,6)
        .Select(_ => Random.Shared.Next(0, 10)));
        var otpHash = BCrypt.Net.BCrypt.HashPassword(otp);

        var challenge = new OtpChallenge
        {
            ElectionId = election.Id,
            Email = email,
            OtpHash = otpHash,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddMinutes(10),
            Attempts = 0
        };

        _db.OtpChallenges.Add(challenge);
        await _db.SaveChangesAsync();

        await _otpSender.SendAsync(email,otp);

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

        var otherChallenges = await _db.OtpChallenges
            .Where(c =>
                c.ElectionId == dto.ElectionId &&
                c.Email == email &&
                c.Id != challenge.Id &&
                c.UsedAt == null)
            .ToListAsync();

        foreach (var other in otherChallenges)
        {
            other.UsedAt = DateTime.UtcNow;
        }

        var token = _jwt.CreateVoterToken(dto.ElectionId, email);

        return Ok(new { token });
    }
}