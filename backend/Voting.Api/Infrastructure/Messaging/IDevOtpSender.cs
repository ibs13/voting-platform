namespace Voting.Api.Infrastructure.Messaging;

public interface IDevOtpSender
{
    Task SendAsync(string email, string otp);
}