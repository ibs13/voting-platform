namespace Voting.Api.Services;

public interface IDevOtpSender
{
    Task SendAsync(string email, string otp);
}