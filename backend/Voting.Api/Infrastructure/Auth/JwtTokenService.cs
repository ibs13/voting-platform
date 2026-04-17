using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace Voting.Api.Infrastructure.Auth;

public class JwtTokenService
{
    private readonly IConfiguration _configuration;

    public JwtTokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string CreateVoterToken(string voterId, string email, string electionId)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, voterId),
            new(ClaimTypes.Email, email),
            new(ClaimTypes.Role, "voter"),
            new("electionId", electionId)
        };

        var expiresAt = DateTime.UtcNow.AddMinutes(GetVoterTokenMinutes());

        return CreateToken(claims, expiresAt);
    }

    public string CreateAdminToken(string adminId, string email)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, adminId),
            new(ClaimTypes.Email, email),
            new(ClaimTypes.Role, "admin")
        };

        var expiresAt = DateTime.UtcNow.AddHours(GetAdminTokenHours());

        return CreateToken(claims, expiresAt);
    }

    private string CreateToken(IEnumerable<Claim> claims, DateTime expiresAtUtc)
    {
        var key = _configuration["Jwt:Key"];
        var issuer = _configuration["Jwt:Issuer"];
        var audience = _configuration["Jwt:Audience"];

        if (string.IsNullOrWhiteSpace(key))
            throw new InvalidOperationException("JWT signing key is missing. Configure 'Jwt:Key'.");

        if (string.IsNullOrWhiteSpace(issuer))
            throw new InvalidOperationException("JWT issuer is missing. Configure 'Jwt:Issuer'.");

        if (string.IsNullOrWhiteSpace(audience))
            throw new InvalidOperationException("JWT audience is missing. Configure 'Jwt:Audience'.");

        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            notBefore: DateTime.UtcNow,
            expires: expiresAtUtc,
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private int GetVoterTokenMinutes()
    {
        var value = _configuration.GetValue<int?>("Jwt:VoterTokenMinutes");

        if (value is null || value <= 0)
            throw new InvalidOperationException("JWT voter token lifetime is invalid. Configure 'Jwt:VoterTokenMinutes'.");

        return value.Value;
    }

    private int GetAdminTokenHours()
    {
        var value = _configuration.GetValue<int?>("Jwt:AdminTokenHours");

        if (value is null || value <= 0)
            throw new InvalidOperationException("JWT admin token lifetime is invalid. Configure 'Jwt:AdminTokenHours'.");

        return value.Value;
    }
}