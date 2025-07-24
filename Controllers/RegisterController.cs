using kul_locall_back_end;
using kul_locall_back_end.models.register;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace kul_local_back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegisterController : ControllerBase
    {
        private readonly IRegister register;
        public RegisterController(IRegister register)
        {
            this.register = register;
        }

        [HttpGet("register")]
        [Authorize]
        public async Task<IResult> GetRegisterTedTeam()
        {
            var user = HttpContext.User;
            var email = user.FindFirst("user_email")?.Value;

            return await register.GetRegisterTedTeam(email);
        }


        [HttpPost("register")]
        [Authorize]
        public async Task<IResult> RegisterTedTeamAsync(RegisterTedTeamDTO registerDTO)
        {
            var user = HttpContext.User;
            var email = user.FindFirst("user_email")?.Value;
            return await register.RegisterTedTeamAsync(registerDTO, email);
        }

        [HttpPost("unregister")]
        [Authorize]
        public async Task<IResult> UnregisterTedTeamAsync(RegisterTedTeamDTO registerDTO)
        {
            var user = HttpContext.User;
            var email = user.FindFirst("user_email")?.Value;
            return await register.UnregisterTedTeamAsync(registerDTO, email);
        }

        [HttpGet("get-all-registered-teams")]
        public async Task<IResult> GetAllRegisteredTeamsAsync()
        {
            return await register.GetAllRegisteredTeamsAsync();
        }

        [HttpGet("accept-register-ted-team/{registerId}")]
        public async Task<IResult> AcceptRegister(string registerId)
        {
            return await register.AcceptRegister(registerId);
        }

        [HttpGet("reject-register-ted-team/{registerId}")]
        public async Task<IResult> RejectRegister(string registerId)
        {
            return await register.RejectRegister(registerId);
        }
    }
}
