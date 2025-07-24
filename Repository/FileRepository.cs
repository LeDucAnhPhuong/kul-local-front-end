using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

public class FileRepository : IFileRepository
{
    private readonly string _baseFolder;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public FileRepository(IHttpContextAccessor httpContextAccessor)
    {
        _baseFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<string> SaveFileAsync(
        IFormFile file,
        string[] allowedExtensions,
        string subFolder = ""
    )
    {
        if (file == null || file.Length == 0)
            throw new ArgumentException("File is empty");

        var extension = Path.GetExtension(file.FileName).ToLower();

        if (!allowedExtensions.Contains(extension))
            throw new InvalidOperationException("Unsupported file type");

        var folderPath = string.IsNullOrEmpty(subFolder)
            ? _baseFolder
            : Path.Combine(_baseFolder, subFolder);

        if (!Directory.Exists(folderPath))
            Directory.CreateDirectory(folderPath);

        var fileName = Guid.NewGuid() + extension;
        var fullPath = Path.Combine(folderPath, fileName);

        using (var stream = new FileStream(fullPath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // ✅ Convert to relative path
        var relativePath = Path.GetRelativePath(_baseFolder, fullPath).Replace("\\", "/"); // for Windows

        var request = _httpContextAccessor.HttpContext?.Request;
        if (request == null)
            throw new InvalidOperationException("HttpContext not available");

        var url = $"https://api.kul-local.me/uploads/{relativePath}";

        return url;
    }
}
