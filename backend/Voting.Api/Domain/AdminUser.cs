namespace Voting.Api.Domain;

public class AdminUser
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Username { get; set; } = "";
    public string PasswordHash { get; set; } = "";
    public DateTimeOffset CreateAt { get; set; } = DateTimeOffset.UtcNow;
}