using Microsoft.EntityFrameworkCore;
using Voting.Api.Infrastructure.Data;

namespace Voting.Api.Extensions;

public static class ApplicationBuilderExtensions
{
    public static async Task SeedDatabaseAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        await db.Database.MigrateAsync();
        await DbSeeder.SeedAsync(db);
    }
}