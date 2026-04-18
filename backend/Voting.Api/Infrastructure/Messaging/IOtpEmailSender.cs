namespace Voting.Api.Infrastructure.Messaging;

public interface IOtpEmailSender
{
    Task SendAsync(string email, string otp);
}