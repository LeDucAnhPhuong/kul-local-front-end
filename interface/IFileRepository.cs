public interface IFileRepository
{
    Task<string> SaveFileAsync(IFormFile file, string[] allowedExtensions, string subFolder = "");
}
