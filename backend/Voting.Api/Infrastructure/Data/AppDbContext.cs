using Microsoft.EntityFrameworkCore;
using Voting.Api.Domain.Entities;
using Voting.Api.Domain.Enums;

namespace Voting.Api.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Election> Elections => Set<Election>();
    public DbSet<Candidate> Candidates => Set<Candidate>();
    public DbSet<Voter> Voters => Set<Voter>();
    public DbSet<OtpChallenge> OtpChallenges => Set<OtpChallenge>();
    public DbSet<VoteLock> VoteLocks => Set<VoteLock>();
    public DbSet<BallotSubmission> BallotSubmissions => Set<BallotSubmission>();
    public DbSet<Vote> Votes => Set<Vote>();
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Election>(entity =>
        {
            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.Status)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired();
        });

        modelBuilder.Entity<Candidate>(entity =>
        {
            entity.Property(c => c.FullName)
                .IsRequired()
                .HasMaxLength(150);

            entity.Property(c => c.Office)
                .IsRequired()
                .HasMaxLength(50);
        });

        modelBuilder.Entity<Voter>(entity =>
        {
            entity.Property(v => v.Email)
                .IsRequired()
                .HasMaxLength(256);

            entity.HasIndex(v => new { v.ElectionId, v.Email })
                .IsUnique();
        });

        modelBuilder.Entity<OtpChallenge>(entity =>
        {
            entity.Property(o => o.Email)
                .IsRequired()
                .HasMaxLength(256);

            entity.Property(o => o.OtpHash)
                .IsRequired();
        });

        modelBuilder.Entity<VoteLock>(entity =>
        {
            entity.HasIndex(vl => new { vl.ElectionId, vl.VoterId })
                .IsUnique();
        });

        modelBuilder.Entity<Vote>(entity =>
        {
            entity.Property(v => v.Office)
                .IsRequired()
                .HasMaxLength(50);

            entity.HasIndex(v => new { v.BallotSubmissionId, v.Office })
                .IsUnique();

            entity.HasIndex(v => new { v.BallotSubmissionId, v.CandidateId })
                .IsUnique();
        });

        modelBuilder.Entity<AdminUser>(entity =>
        {
            entity.Property(a => a.Username)
                .IsRequired()
                .HasMaxLength(50);

            entity.HasIndex(a => a.Username)
                .IsUnique();
        });
    }
}