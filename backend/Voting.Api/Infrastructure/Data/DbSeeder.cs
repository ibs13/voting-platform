using Microsoft.EntityFrameworkCore;
using Voting.Api.Domain.Entities;

namespace Voting.Api.Infrastructure.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (await db.AdminUsers.AnyAsync())
            return;

        var admin = new AdminUser
        {
            Username = "admin",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@12345")
        };

        db.AdminUsers.Add(admin);
        await db.SaveChangesAsync();
    }
}