using kul_locall_back_end.models.auth;
using Microsoft.AspNetCore.Mvc;

namespace kul_locall_back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly IAuthentication _repository_auth;
        public AuthController(IAuthentication repository)
        {
            _repository_auth = repository;
        }

        [HttpPost("login-google")]
        public async Task<IResult> LoginWithGoogleAsync(TokenDTO auth)
        {
            var result = await _repository_auth.LoginWithGoogleAsync(auth.Token);
            return result;
        }

    }
}
