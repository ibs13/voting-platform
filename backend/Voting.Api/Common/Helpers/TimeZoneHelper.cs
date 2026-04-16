namespace Voting.Api.Common.Helpers;

public static class TimeZoneHelper
{
    public static TimeZoneInfo GetBangladeshTimeZone()
    {
        try
        {
            // Windows
            return TimeZoneInfo.FindSystemTimeZoneById("Bangladesh Standard Time");
        }
        catch (TimeZoneNotFoundException)
        {
            // Linux / macOS / Docker
            return TimeZoneInfo.FindSystemTimeZoneById("Asia/Dhaka");
        }
    }

    public static DateTime ConvertBangladeshLocalToUtc(DateTime localDateTime)
    {
        var bdTimeZone = GetBangladeshTimeZone();

        // Treat incoming value as Bangladesh local time
        var unspecified = DateTime.SpecifyKind(localDateTime, DateTimeKind.Unspecified);

        return TimeZoneInfo.ConvertTimeToUtc(unspecified, bdTimeZone);
    }

    public static DateTime ConvertUtcToBangladesh(DateTime utcDateTime)
    {
        var bdTimeZone = GetBangladeshTimeZone();

        var utc = utcDateTime.Kind == DateTimeKind.Utc
            ? utcDateTime
            : DateTime.SpecifyKind(utcDateTime, DateTimeKind.Utc);

        return TimeZoneInfo.ConvertTimeFromUtc(utc, bdTimeZone);
    }
}