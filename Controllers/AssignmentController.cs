using kul_local_back_end.Entities;
using kul_local_back_end.models.assignment;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace kul_local_back_end.Controllers
{
    [ApiController]
    [Route("api/assignments")]
    public class AssignmentController : ControllerBase
    {
        private readonly IAssignmentRepository _repo;

        public AssignmentController(IAssignmentRepository repo)
        {
            _repo = repo;
        }

        [HttpGet("get-for-coach")]
        public async Task<IResult> GetForCoach()
        {
            var user = HttpContext.User;
            var email = user.FindFirst("user_email")?.Value;
            return await _repo.GetForCoachAsync(email);
        }
        [HttpGet("get-for-student")]
        public async Task<IResult> GetForStudent()
        {
            var user = HttpContext.User;
            var email = user.FindFirst("user_email")?.Value;
            return await _repo.GetForStudent(email);
        }

        [HttpPost]
        [Authorize]
        public async Task<IResult> Create( CreateAssignmentDTO dto)
        {
            var user = HttpContext.User;
            var email = user.FindFirst("user_email")?.Value;
          
            return await _repo.CreateAsync(dto, email);
        }


        [HttpPut("{id}")]
        [Authorize]
        public async Task<IResult> Update(string id, [FromBody] UpdateAssignmentDTO dto)
        {
            var user = HttpContext.User;
            var email = user.FindFirst("user_email")?.Value;

            return await _repo.UpdateAsync(id, dto, email);
        }

        [HttpGet]
        public async Task<IResult> GetAll() => await _repo.GetAllAsync();

        [HttpGet("{id}")]
        public async Task<IResult> Get(string id) => await _repo.GetByAssignmentIdAsync(id);

        [HttpDelete("{id}")]
        public async Task<IResult> Delete(string id) => await _repo.DeleteAsync(id);

       
    }

}
