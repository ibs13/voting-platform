using Microsoft.EntityFrameworkCore;
using Voting.Api.Domain;

namespace Voting.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    public DbSet<Election> Elections => Set<Election>();
    public DbSet<Candidate> Candidates => Set<Candidate>();
    public DbSet<Voter> Voters => Set<Voter>();
    public DbSet<OtpChallenge> OtpChallenges => Set<OtpChallenge>();
    public DbSet<VoteLock> VoteLocks => Set<VoteLock>();
    public DbSet<BallotSubmission> BallotSubmissions => Set<BallotSubmission>();
    public DbSet<Vote> Votes => Set<Vote>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Voter>()
            .HasIndex(v => new { v.ElectionId, v.Email })
            .IsUnique();

        modelBuilder.Entity<VoteLock>()
            .HasIndex(vl => new { vl.ElectionId, vl.VoterId })
            .IsUnique();

        modelBuilder.Entity<Vote>()
            .HasIndex(v => new { v.BallotSubmissionId, v.Office })
            .IsUnique();

        modelBuilder.Entity<Vote>()
            .HasIndex(v => new { v.BallotSubmissionId, v.CandidateId })
            .IsUnique();
    }
}
