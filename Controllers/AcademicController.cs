using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace kul_local_back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AcademicController : ControllerBase
    {
        private readonly IAcademicRepository _academic;

        public AcademicController(IAcademicRepository academic)
        {
            _academic = academic;
        }

        [HttpGet("progress")]
        [Authorize]
        public async Task<IResult> GetProgress()
        {
            var user = HttpContext.User;
            var email = user.FindFirst("user_email")?.Value;

            return await _academic.GetProgressForStudentAsync(email);
        }

        [HttpGet("class")]
        public async Task<IResult> GetByClass([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            return await _academic.GetScoreStatisticsByClassAsync(startDate, endDate);
        }

        [HttpGet("coach")]
        public async Task<IResult> GetByCoach([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            return await _academic.GetScoreStatisticsByCoachAsync(startDate, endDate);
        }

        [HttpGet("class/{classId}")]
        public async Task<IResult> GetByClass(string classId, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            return await _academic.GetClassAcademicSummaryAsync(classId, startDate, endDate);
        }

        [HttpGet("coach/{coachId}")]
        public async Task<IResult> GetByCoach(string coachId, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            return await _academic.GetCoachAcademicSummaryAsync(coachId, startDate, endDate);
        }
        [HttpGet("register")]
        public async Task<IResult> GetTedTeamRegisterSummary(DateTime startDate, DateTime endDate)
       => await _academic.GetTedTeamRegisterSummaryAsync(startDate, endDate);

        [HttpGet("register/personal/{tedteamId}")]
        public async Task<IResult> GetTedTeamRegisterSummaryByEmail(string tedteamId, DateTime startDate, DateTime endDate)
            => await _academic.GetTedTeamRegisterSummaryByTedTeamIdAsync(tedteamId, startDate, endDate);

        [HttpGet("coach/personal")]
        [Authorize]
        public async Task<IResult> GetCoachPersonalSummary()
        {
            var user = HttpContext.User;
            var email = user.FindFirst("user_email")?.Value;
           
            return await _academic.GetCoachQuizStatisticsAsync(email);
        }

        [HttpGet("quiz/results")]
        [Authorize]
        public async Task<IResult> GetQuizResultsByCoach([FromQuery] string classId)
        {
            var user = HttpContext.User;
            var email = user.FindFirst("user_email")?.Value;
            return await _academic.GetQuizResultsByCoachAsync(email, classId);
        }

        [HttpGet("quiz/results/{quizId}")]
        [Authorize]
        public async Task<IResult> GetQuizResultsByQuizId(string quizId)
        {
            var user = HttpContext.User;
            var email = user.FindFirst("user_email")?.Value;
            return await _academic.GetQuizResultsByQuizId(email, quizId);
        }
    }

}
