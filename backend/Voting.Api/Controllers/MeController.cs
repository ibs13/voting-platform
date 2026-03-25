using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Voting.Api.Controllers;

[ApiController]
[Route("auth")]
public class MeController : ControllerBase
{
    [Authorize]
    [HttpGet("me")]
    public IActionResult Me()
    {
        var role = User.FindFirstValue(ClaimTypes.Role) ?? "unknown";

        if (role == "admin")
        {
            var username = User.FindFirstValue(ClaimTypes.Name) ?? "admin";
            return Ok(new
            {
                role = "admin",
                username
            });
        }

        if (role == "voter")
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var electionId = User.FindFirstValue("electionId");
            return Ok(new
            {
                role = "voter",
                email,
                electionId
            });
        }

        return Ok(new { role });
    }
}