using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace Voting.Api.Infrastructure.Messaging;

public class SmtpOtpEmailSender : IOtpEmailSender
{
    private readonly EmailOptions _options;

    public SmtpOtpEmailSender(IOptions<EmailOptions> options)
    {
        _options = options.Value;
    }

    public async Task SendAsync(string email, string otp)
    {
        if (string.IsNullOrWhiteSpace(_options.SenderEmail))
            throw new InvalidOperationException("Email sender address is missing.");

        if (string.IsNullOrWhiteSpace(_options.SmtpHost))
            throw new InvalidOperationException("SMTP host is missing.");

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(_options.SenderName, _options.SenderEmail));
        message.To.Add(MailboxAddress.Parse(email));
        message.Subject = "Your OTP for Voting Platform";

        var bodyBuilder = new BodyBuilder
        {
            HtmlBody = $"""
                <p>Your OTP is: <strong>{otp}</strong></p>
                <p>This code will expire soon.</p>
                """,
            TextBody = $"Your OTP is: {otp}"
        };

        message.Body = bodyBuilder.ToMessageBody();

        using var client = new SmtpClient();
        client.Timeout = 15000;

        var socketOptions = _options.SmtpUseStartTls
            ? SecureSocketOptions.StartTls
            : SecureSocketOptions.SslOnConnect;

        try
        {
            Console.WriteLine($"SMTP CONNECT: Host={_options.SmtpHost}, Port={_options.SmtpPort}, Security={socketOptions}, User={_options.SmtpUsername}");

            await client.ConnectAsync(
                _options.SmtpHost,
                _options.SmtpPort,
                socketOptions);

            if (!string.IsNullOrWhiteSpace(_options.SmtpUsername))
            {
                await client.AuthenticateAsync(_options.SmtpUsername, _options.SmtpPassword);
            }

            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
        catch (Exception ex)
        {
            Console.WriteLine("SMTP ERROR: " + ex);
            throw;
        }
    }
}