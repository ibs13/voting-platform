using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;

namespace Voting.Api.Infrastructure.Messaging;

public class BrevoOtpEmailSender : IOtpEmailSender
{
    private readonly HttpClient _httpClient;
    private readonly EmailOptions _emailOptions;
    private readonly BrevoOptions _brevoOptions;

    public BrevoOtpEmailSender(
        HttpClient httpClient,
        IOptions<EmailOptions> emailOptions,
        IOptions<BrevoOptions> brevoOptions)
    {
        _httpClient = httpClient;
        _emailOptions = emailOptions.Value;
        _brevoOptions = brevoOptions.Value;
    }

    public async Task SendAsync(string email, string otp)
    {
        if (string.IsNullOrWhiteSpace(_brevoOptions.ApiKey))
            throw new InvalidOperationException("Brevo API key is missing.");

        if (string.IsNullOrWhiteSpace(_emailOptions.SenderEmail))
            throw new InvalidOperationException("Sender email is missing.");

        var payload = new
        {
            sender = new
            {
                name = _emailOptions.SenderName,
                email = _emailOptions.SenderEmail
            },
            to = new[]
            {
                new { email }
            },
            subject = "Your OTP for Voting Platform",
            htmlContent = $"""
                <html>
                  <body>
                    <p>Your OTP is: <strong>{otp}</strong></p>
                    <p>This code will expire soon.</p>
                  </body>
                </html>
                """,
            textContent = $"Your OTP is: {otp}"
        };

        using var request = new HttpRequestMessage(
            HttpMethod.Post,
            "https://api.brevo.com/v3/smtp/email");

        request.Headers.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/json"));
        request.Headers.Add("api-key", _brevoOptions.ApiKey);

        request.Content = new StringContent(
            JsonSerializer.Serialize(payload),
            Encoding.UTF8,
            "application/json");

        using var response = await _httpClient.SendAsync(request);
        var responseBody = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            throw new InvalidOperationException(
                $"Brevo email send failed. Status: {(int)response.StatusCode}. Response: {responseBody}");
        }
    }
}