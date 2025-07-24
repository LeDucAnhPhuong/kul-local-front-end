using Microsoft.AspNetCore.Mvc;
using kul_local_back_end.Repositories;
using kul_local_back_end.Entities;
using kul_local_back_end.models.quiz;
using Microsoft.AspNetCore.Authorization;

namespace kul_local_back_end.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuizController : ControllerBase
    {
        private readonly IQuizRepository _quizRepo;

        public QuizController(IQuizRepository quizRepo)
        {
            _quizRepo = quizRepo;
        }

        [HttpPost("create")]
        [Authorize]
        public async Task<IResult> Create( CreateQuizDTO quiz)
        {

            var user = HttpContext.User;
            var email = user.FindFirst("user_email")?.Value;

            return await _quizRepo.CreateQuizAsync(quiz, email);
        }

        [HttpGet("all")]
        public async Task<IResult> GetAll()
        {
            return await _quizRepo.GetAllQuizzesAsync();
        }

        [HttpGet("{id}")]
        public async Task<IResult> GetById(string id)
        {
            return await _quizRepo.GetQuizByIdAsync(id);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IResult> Update(string id,UpdateQuizDTO quiz)
        {
            var user = HttpContext.User;
            var email = user.FindFirst("user_email")?.Value;

            return await _quizRepo.UpdateQuizAsync(id, quiz, email);
        }

        [HttpDelete("{id}")]
        public async Task<IResult> Delete(string id)
        {
            return await _quizRepo.DeleteQuizAsync(id);
        }

        [HttpGet("coach")]
        [Authorize]
        public async Task<IResult> GetForCoach()
        {
            var user = HttpContext.User;
            var email = user.FindFirst("user_email")?.Value;

            return await _quizRepo.GetQuizzesForCoachAsync(email);
        }

        [HttpGet("student")]
        [Authorize]
        public async Task<IResult> GetForStudent()
        {
            var user = HttpContext.User;
            var email = user.FindFirst("user_email")?.Value;
            return await _quizRepo.GetAvailableQuizzesForStudentAsync(email);
        }
    }
}
