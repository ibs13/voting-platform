namespace Voting.Api.Dtos;

public record AuthRequestOtpDto(Guid ElectionId, string Email);