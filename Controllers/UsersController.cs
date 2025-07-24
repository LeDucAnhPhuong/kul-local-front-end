using kul_local_back_end.Entities;
using kul_locall_back_end.models.user;
using kul_locall_back_end.repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace kul_local_back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _repository_user;
        public UsersController(IUserRepository userRepository)
        {
            _repository_user = userRepository;
        }

        [HttpGet("get-role")]
        [Authorize]
        public async Task<IResult> GetUserRoleAsync()
        {
            var user = HttpContext.User;
            var email = user.FindFirst("user_email")?.Value;

            var result = await _repository_user.GetRole(email);
            return result;
        }

        [HttpGet("students")]
        public async Task<IResult> GetStudentsAsync()
        {
            var result = await _repository_user.GetUsersByRoleAsync(UserRole.Student);
            return result;
        }

        [HttpGet("coaches")]
        public async Task<IResult> GetCoachesAsync()
        {
            var result = await _repository_user.GetUsersByRoleAsync(UserRole.Coach);
            return result;
        }

        [HttpGet("admins")]
        public async Task<IResult> GetAdminsAsync()
        {
            var result = await _repository_user.GetUsersByRoleAsync(UserRole.Admin);
            return result;
        }

        [HttpGet("tedteams")]
        public async Task<IResult> GetTedTeamAsync()
        {
            var result = await _repository_user.GetUsersByRoleAsync(UserRole.Tedteam);
            return result;
        }

        [HttpPost("student")]
        public async Task<IResult> CreateStudentAsync( CreateDTOStudent user)
        {
            var result = await _repository_user.CreateUserAsync(user, UserRole.Student);
            return result;
        }

        [HttpPost("admin")]
        public async Task<IResult> CreateAdminAsync(CreateDTOStudent user)
        {
            var result = await _repository_user.CreateUserAsync(user, UserRole.Admin);
            return result;
        }

        [HttpPost("coach")]
        public async Task<IResult> CreateCoachAsync(CreateDTOStudent user)
        {
            var result = await _repository_user.CreateUserAsync(user, UserRole.Coach);
            return result;
        }

        [HttpPost("ted-team")]
        public async Task<IResult> CreateTedTeamAsync(CreateDTOStudent user)
        {
            var result = await _repository_user.CreateUserAsync(user, UserRole.Tedteam);
            return result;
        }


    }
}
