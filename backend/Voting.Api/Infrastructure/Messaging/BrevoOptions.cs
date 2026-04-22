namespace Voting.Api.Infrastructure.Messaging;

public class BrevoOptions
{
    public const string SectionName = "Brevo";

    public string ApiKey { get; set; } = string.Empty;
}