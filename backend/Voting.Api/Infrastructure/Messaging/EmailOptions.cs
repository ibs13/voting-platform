namespace Voting.Api.Infrastructure.Messaging;

public class EmailOptions
{
    public string Provider { get; set; } = "Dev";

    public string SenderEmail { get; set; } = "";
    public string SenderName { get; set; } = "Voting Platform";

    public string SmtpHost { get; set; } = "";
    public int SmtpPort { get; set; } = 587;
    public string SmtpUsername { get; set; } = "";
    public string SmtpPassword { get; set; } = "";
    public bool SmtpUseStartTls { get; set; } = true;
}