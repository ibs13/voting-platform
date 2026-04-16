namespace Voting.Api.Contracts.Requests.Auth;

public record AuthVerifyOtpRequest(Guid ElectionId, string Email, string Otp);