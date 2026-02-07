namespace Voting.Api.Dtos;

public record AuthVerifyOtpDto(Guid ElectionId, string Email, string Otp);