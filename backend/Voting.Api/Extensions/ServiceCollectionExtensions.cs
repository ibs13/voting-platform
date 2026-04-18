using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Voting.Api.Infrastructure.Auth;
using Voting.Api.Infrastructure.Data;
using Voting.Api.Infrastructure.Imports;
using Voting.Api.Infrastructure.Messaging;

namespace Voting.Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddAppControllers(this IServiceCollection services)
    {
        services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            });

        return services;
    }

    public static IServiceCollection AddPersistence(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("Default");

        if (string.IsNullOrWhiteSpace(connectionString))
            throw new InvalidOperationException("Connection string 'Default' is missing.");

        services.AddDbContext<AppDbContext>(options =>
        {
            options.UseSqlite(connectionString);
        });

        return services;
    }

    public static IServiceCollection AddInfrastructureServices(
    this IServiceCollection services,
    IConfiguration configuration)
    {
    services.Configure<EmailOptions>(configuration.GetSection("Email"));

    var provider = configuration["Email:Provider"]?.ToLowerInvariant();

    if (provider == "smtp")
    {
        services.AddScoped<IOtpEmailSender, SmtpOtpEmailSender>();
    }
    else
    {
        services.AddScoped<IOtpEmailSender, DevOtpEmailSender>();
    }

    services.AddScoped<JwtTokenService>();
    services.AddScoped<CsvImportService>();

    return services;
    }

    public static IServiceCollection AddJwtAuthentication(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var jwtSection = configuration.GetSection("Jwt");

        var jwtKey = configuration["Jwt:Key"];
        var issuer = jwtSection["Issuer"];
        var audience = jwtSection["Audience"];

        if (string.IsNullOrWhiteSpace(jwtKey))
            throw new InvalidOperationException("JWT signing key is missing. Configure 'Jwt:Key'.");

        if (string.IsNullOrWhiteSpace(issuer))
            throw new InvalidOperationException("JWT issuer is missing. Configure 'Jwt:Issuer'.");

        if (string.IsNullOrWhiteSpace(audience))
            throw new InvalidOperationException("JWT audience is missing. Configure 'Jwt:Audience'.");

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = issuer,
                    ValidateAudience = true,
                    ValidAudience = audience,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtKey)),
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.FromSeconds(30)
                };
            });

        services.AddAuthorization();

        return services;
    }

    public static IServiceCollection AddAppCors(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var allowedOrigins = configuration
            .GetSection("Cors:AllowedOrigins")
            .Get<string[]>();

        if (allowedOrigins is null || allowedOrigins.Length == 0)
            throw new InvalidOperationException("CORS allowed origins are missing. Configure 'Cors:AllowedOrigins'.");

        services.AddCors(options =>
        {
            options.AddPolicy("Frontend", policy =>
            {
                policy.WithOrigins(allowedOrigins)
                      .AllowAnyHeader()
                      .AllowAnyMethod();
            });
        });

        return services;
    }
}