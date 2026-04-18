namespace Voting.Api.Infrastructure.Messaging;

public class DevOtpEmailSender : IOtpEmailSender
{
    public Task SendAsync(string email, string otp)
    {
        Console.WriteLine($"[DEV OTP] Email: {email} OTP: {otp}");
        return Task.CompletedTask;
    }
}