using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Voting.Api.Infrastructure.Data;
using Voting.Api.Contracts.Requests.Admin;
using Voting.Api.Infrastructure.Auth;

namespace Voting.Api.Controllers.Admin;

[ApiController]
[Route("admin/auth")]
public class AdminAuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly JwtTokenService _jwt;

    public AdminAuthController(AppDbContext db, JwtTokenService jwt)
    {
        _db = db;
        _jwt = jwt;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] AdminLoginRequest dto)
    {
        var username = dto.Username.Trim();

        var admin = await _db.AdminUsers
            .FirstOrDefaultAsync(a => a.Username == username);

        if (admin is null) return Unauthorized("Invalid credentials.");

        var ok = BCrypt.Net.BCrypt.Verify(dto.Password, admin.PasswordHash);
        if (!ok) return Unauthorized("Invalid credentials.");

        var token = _jwt.CreateAdminToken(admin.Username);
        return Ok(new { token });
    }
}