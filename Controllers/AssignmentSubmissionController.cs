using kul_local_back_end.models.assignment;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace kul_local_back_end.Controllers
{
    [ApiController]
    [Route("api/assignment-submissions")]
    public class AssignmentSubmissionController : ControllerBase
    {
        private readonly IAssignmentSubmissionRepository _repo;

        public AssignmentSubmissionController(IAssignmentSubmissionRepository repo)
        {
            _repo = repo;
        }

        [HttpPost]
        [Authorize]
        public async Task<IResult> Submit([FromBody] CreateAssignmentSubmissionDTO dto)
        {
            var user = HttpContext.User;
            var email = user.FindFirst("user_email")?.Value;
           
            return await _repo.SubmitAsync(dto, email);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IResult> Update(string id, [FromBody] UpdateAssignmentSubmissionDTO dto)
        {
            var user = HttpContext.User;
            var email = user.FindFirst("user_email")?.Value;

            return await _repo.UpdateSubmissionAsync(id, dto, email);
        }

        [HttpPost("{id}/grade")]
        public async Task<IResult> Grade(string id, [FromBody] GradeSubmissionDTO dto)
            => await _repo.GradeAsync(id, dto);

        [HttpGet("student")]
        [Authorize]
        public async Task<IResult> GetStudentSubmissions()
        {
            var user = HttpContext.User;
            var email = user.FindFirst("user_email")?.Value;
            return await _repo.GetStudentSubmissions(email);
        }


        [HttpGet("coach/{assignmentId}")]
        [Authorize]
        public async Task<IResult> GetCoachSubmissions(string assignmentId)
        {
            var user = HttpContext.User;
            var email = user.FindFirst("user_email")?.Value;
            return await _repo.GetCoachAssignmentSubmissions(email, assignmentId);
        }

        [HttpGet("assignment/{id}")]
        public async Task<IResult> GetSubmissionsByAssignmentId(string id)
            => await _repo.GetAssignmentSubmissionsByAssignmentId(id);

    }

}
