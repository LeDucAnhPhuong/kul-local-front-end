using kul_local_back_end.Entities;
using kul_local_back_end.models.news;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace kul_local_back_end.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NewsController : ControllerBase
    {
        private readonly INewsRepository _newsRepo;

        public NewsController(INewsRepository newsRepo)
        {
            _newsRepo = newsRepo;
        }

        [HttpGet]
        public async Task<IResult> GetAll([FromQuery] int? page, [FromQuery] int? size, [FromQuery] string? search) =>
            await _newsRepo.GetAllNewsAsync(page, size, search);

        [HttpGet("{id}")]
        public async Task<IResult> GetById(string id) => await _newsRepo.GetNewsByIdAsync(id);

        [HttpPost]
        [Authorize]
        public async Task<IResult> Create(CreateNewsDTO news) {

            var user = HttpContext.User;
            var email = user.FindFirst("user_email")?.Value;

            return await _newsRepo.CreateNewsAsync(news, email);

        }

        [HttpGet("student")]
        [Authorize]
        public async Task<IResult> GetNewsForStudent()
        {
            var user = HttpContext.User;
            var email = user.FindFirst("user_email")?.Value;
            return await _newsRepo.GetNewsByUserAsync(email);
        }

        [HttpGet("coach")]
        [Authorize]
        public async Task<IResult> GetNewsForCoach()
        {
            var user = HttpContext.User;
            var email = user.FindFirst("user_email")?.Value;
            return await _newsRepo.GetNewsByCoachAsync(email);
        }

        [HttpGet("get-all")]
        public async Task<IResult> GetAllNews()
        {
            return await _newsRepo.GetAllNewsAsync();
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IResult> Update(string id, UpdateNewsDTO news)
        {
            var user = HttpContext.User;
            var email = user.FindFirst("user_email")?.Value;

            return   await _newsRepo.UpdateNewsAsync(id, news, email);
        }

        [HttpDelete("{id}")]
        public async Task<IResult> Delete(string id) => await _newsRepo.DeleteNewsAsync(id);
    }

}
