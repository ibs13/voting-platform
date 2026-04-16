namespace Voting.Api.Infrastructure.Imports;

public class CsvImportService
{
    public List<string[]> ParseLines(IFormFile file)
    {
        if (file.Length == 0)
            throw new InvalidOperationException("Uploaded file is empty.");

        var rows = new List<string[]>();

        using var stream = file.OpenReadStream();
        using var reader = new StreamReader(stream);

        while (!reader.EndOfStream)
        {
            var line = reader.ReadLine();
            if (string.IsNullOrWhiteSpace(line))
                continue;

            var columns = line.Split(',')
                .Select(x => x.Trim())
                .ToArray();

            rows.Add(columns);
        }

        return rows;
    }
}