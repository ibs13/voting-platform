namespace Voting.Api.Infrastructure.Messaging;

public class ConsoleDevOtpSender : IDevOtpSender
{
    public Task SendAsync(string email, string otp)
    {
        Console.WriteLine($"[DEV OTP] Email: {email} OTP: {otp}");
        return Task.CompletedTask;
    }
}