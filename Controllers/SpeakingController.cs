using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using kul_local_back_end.Models.Speaking;
using kul_local_back_end.Repository;

namespace kul_local_back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SpeakingController : ControllerBase
    {
        private readonly ISpeakingRepository _speakingRepo;

        public SpeakingController(ISpeakingRepository speakingRepo)
        {
            _speakingRepo = speakingRepo;
        }

        [HttpPost]
        [Authorize]
        public async Task<IResult> Create([FromBody] CreateSpeakingDTO dto)
        {
            var user = HttpContext.User;
            var email = user.FindFirst("user_email")?.Value;

            return await _speakingRepo.CreateSpeakingAsync(dto, email);
        }
        [HttpGet("leaderboard")]
        [Authorize]
        public async Task<IResult> GetLeaderboard(DateTime startDate, DateTime endDate)
        {
            var user = HttpContext.User;
            var email = user.FindFirst("user_email")?.Value;
            return await _speakingRepo.GetLeaderboardAsync(startDate, endDate, email);
        }
    }
}
