using kul_locall_back_end.models.classes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace kul_local_back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClassController : ControllerBase
    {
        private readonly IClass _classRepository;
        public ClassController(IClass classRepository)
        {
            _classRepository = classRepository;

        }

        [HttpGet("get-class-for-tedteam")]
        [Authorize]
        public async Task<IResult> GetClassesForTedTeam()
        {
            var user = HttpContext.User;
            var email = user.FindFirst("user_email")?.Value;
            return await _classRepository.GetClassesForTedTeamAsync(email);
        }

        [HttpGet("classes")]
        public async Task<IResult> GetAll()
        {
            return await _classRepository.GetAllClassesAsync();
        }

        [HttpPost()]
        public async Task<IResult> CreateClass(CreateClassDTO classDTO)
        {
            return await _classRepository.CreateClassAsync(classDTO);
        }

        [HttpGet("{id}")]
        public async Task<IResult> GetClassById(string id) {
            return await _classRepository.GetClassByIdAsync(id);
        }

        [HttpDelete("{id}")]
        public async Task<IResult> DeleteClassById(string id)
        {
            return await _classRepository.DeleteClassAsync(id);
        }

    }
}
