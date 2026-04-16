using Microsoft.EntityFrameworkCore;
using Voting.Api.Domain.Entities;
using Voting.Api.Domain.Enums;

namespace Voting.Api.Infrastructure.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (await db.Elections.AnyAsync()) return;

        var election = new Election
        {
            Name = "Debating Society Alumni Election",
            Status = "Open",
            StartAt = DateTime.UtcNow.AddDays(-1),
            EndAt = DateTime.UtcNow.AddDays(7)
        };

        db.Elections.Add(election);

        db.Candidates.AddRange(
            new Candidate { ElectionId = election.Id, FullName = "Candidate A", Batch = "2016", Office = Office.President },
            new Candidate { ElectionId = election.Id, FullName = "Candidate B", Batch = "2017", Office = Office.Secretary },
            new Candidate { ElectionId = election.Id, FullName = "Candidate C", Batch = "2018", Office = Office.Treasurer },
            new Candidate { ElectionId = election.Id, FullName = "Candidate D", Batch = "2019", Office = Office.President }
        );

        db.Voters.AddRange(
            new Voter { ElectionId = election.Id, Email = "test1@example.com", IsEligible = true },
            new Voter { ElectionId = election.Id, Email = "test2@example.com", IsEligible = true },
            new Voter { ElectionId = election.Id, Email = "test3@example.com", IsEligible = true },
            new Voter { ElectionId = election.Id, Email = "test4@example.com", IsEligible = true },
            new Voter { ElectionId = election.Id, Email = "test5@example.com", IsEligible = true },
            new Voter { ElectionId = election.Id, Email = "test6@example.com", IsEligible = true },
            new Voter { ElectionId = election.Id, Email = "test7@example.com", IsEligible = true }
        );

        if (!await db.AdminUsers.AnyAsync())
        {
            var admin = new AdminUser
            {
                Username = "admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@12345")
            };

            db.AdminUsers.Add(admin);
            await db.SaveChangesAsync();
        }

        await db.SaveChangesAsync();
    }
}
