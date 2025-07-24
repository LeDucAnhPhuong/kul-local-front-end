using kul_local_back_end.Entities;
using kul_local_back_end.models.news;
using kul_locall_back_end.repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class NewsResultController : ControllerBase
{
    private readonly INewsResultRepository _repo;

    public NewsResultController(INewsResultRepository repo)
    {
        _repo = repo;
    }

    [HttpPost]
    [Authorize]
    public async Task<IResult> Create([FromBody] CreateNewsResultDTO dto)
    {
       var user = HttpContext.User;
        var email = user.FindFirst("user_email")?.Value;

        return await _repo.CreateNewsResultAsync(dto, email);
    }

    [HttpGet("{newsId}")]
    public async Task<IResult> GetByNewsId(string newsId) => await _repo.GetNewsResultByNewsIdAsync(newsId);

    [HttpGet("student")]
    [Authorize]

    public async Task<IResult> GetForStudent()
    {
        var user = HttpContext.User;
        var email = user.FindFirst("user_email")?.Value;

        return user == null ? Results.NotFound() : await _repo.GetNewsResultForStudentAsync(email);
    }

    [HttpGet("coach")]
    [Authorize]
    public async Task<IResult> GetForCoach()
    {
        var user = HttpContext.User;
        var email = user.FindFirst("user_email")?.Value;
        return user == null ? Results.NotFound() : await _repo.GetNewsResultForCoachAsync(email);
    }
}
