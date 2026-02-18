using System.Security.Claims;

namespace Voting.Api.Services;

public static class UserClaims
{
    public static string GetEmail(ClaimsPrincipal user)
        => user.FindFirstValue(ClaimTypes.Email)
        ?? throw new InvalidOperationException("Missing email claim.");

    public static Guid GetElectionId(ClaimsPrincipal user)
    {
        var raw = user.FindFirstValue("electionId")
            ?? throw new InvalidOperationException("Missing electionId claim.");

        return Guid.Parse(raw);
    }
}