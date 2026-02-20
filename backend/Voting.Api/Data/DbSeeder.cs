using Microsoft.EntityFrameworkCore;
using Voting.Api.Domain;

namespace Voting.Api.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (await db.Elections.AnyAsync()) return;

        var election = new Election
        {
            Name = "Debating Society Alumni Election",
            Status = "Open",
            StartAt = DateTimeOffset.UtcNow.AddDays(-1),
            EndAt = DateTimeOffset.UtcNow.AddDays(7)
        };

        db.Elections.Add(election);

        db.Candidates.AddRange(
            new Candidate { ElectionId = election.Id, FullName = "Candidate A", Batch = "2016" },
            new Candidate { ElectionId = election.Id, FullName = "Candidate B", Batch = "2017" },
            new Candidate { ElectionId = election.Id, FullName = "Candidate C", Batch = "2018" },
            new Candidate { ElectionId = election.Id, FullName = "Candidate D", Batch = "2019" }
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

        await db.SaveChangesAsync();
    }
}
