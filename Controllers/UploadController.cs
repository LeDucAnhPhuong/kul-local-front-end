using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class UploadController : ControllerBase
{
    private readonly IFileRepository _fileRepository;

    public UploadController(IFileRepository fileRepository)
    {
        _fileRepository = fileRepository;
    }

    [HttpPost("video")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadVideo(IFormFile file)
    {
        var allowedExtensions = new[] { ".mp4", ".avi", ".mov", ".mkv", ".webm", ".wmv" };

        try
        {
            var path = await _fileRepository.SaveFileAsync(file, allowedExtensions, "Videos");
            return Ok(new { message = "Video uploaded", path });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost("image")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        try
        {
            var allowed = new[] { ".jpg", ".jpeg", ".png", ".gif" };
            var url = await _fileRepository.SaveFileAsync(file, allowed, "Images");
            return Ok(new { message = "Image uploaded successfully", url });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("file")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadFile(IFormFile file)
    {
        try
        {
            var allowedExtensions = new[]
{
    ".pdf", ".docx", ".txt", ".xlsx", ".pptx", // văn bản & office
    ".mp4", ".mov", ".avi", ".mkv", ".wmv", ".flv", // video
    ".zip", ".rar", ".7z" // tệp nén
};
            var url = await _fileRepository.SaveFileAsync(file, allowedExtensions, "Files");
            return Ok(new { message = "File uploaded successfully", url });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
