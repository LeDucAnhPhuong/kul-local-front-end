using kul_local_back_end.models.quizResult;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace kul_local_back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizResultController : ControllerBase
    {
        private readonly IQuizResultRepository _quizResultRepository;
        public QuizResultController(IQuizResultRepository quizResultRepository)
        {
            _quizResultRepository = quizResultRepository;
        }
        [HttpPost("submit")]
        [Authorize]
        public async Task<IResult> SubmitQuizResult(CreateQuizResultDTO result)
        {
            var user = HttpContext.User;
            var email = user.FindFirst("user_email")?.Value;

            var response = await _quizResultRepository.SubmitQuizResultAsync(result, email);
            return response;
        }
        [HttpGet("user")]
        [Authorize]
        public async Task<IResult> GetResultsByUser()
        {
            var user = HttpContext.User;
            var email = user.FindFirst("user_email")?.Value;

            var response = await _quizResultRepository.GetResultsByUserAsync(email);
            return response;
        }
        [HttpGet("quiz/{quizId}")]
        public async Task<IResult> GetResultsByQuiz(string quizId)
        {
            var response = await _quizResultRepository.GetResultsByQuizAsync(quizId);
            return response;
        }

        [HttpGet("leaderboard")]
        public async Task<IResult> GetLeaderboard(DateTime startDate, DateTime endDate)
        {
            var response = await _quizResultRepository.GetLeaderboard(startDate, endDate);
            return response;
        }
    }
}
