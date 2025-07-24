using kul_local_back_end.Entities;
using kul_locall_back_end;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace kul_local_back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendanceController : ControllerBase
    {
        private readonly IAttendance _attendance;
        public AttendanceController(IAttendance attendance)
        {
            _attendance = attendance;
        }

        [HttpGet("get-personal")]
        [Authorize]
        public async Task<IResult> GetPersonalAttendance(DateTime startDate, DateTime endDate)
        {
            var user = HttpContext.User;
            var email = user.FindFirst("user_email")?.Value;

            return await _attendance.GetPersonalAttendance(email, startDate, endDate);
        }

        [HttpPut()]
        [Authorize]
        public async Task<IResult> UpdateAttendance(CheckAttendanceRequest request)
        {
            var user = HttpContext.User;
            var email = user.FindFirst("user_email")?.Value;

            return await _attendance.CheckAttendanceAsync( request, email);
        }

        [HttpGet("get-all")]
        public async Task<IResult> GetAllAttendance()
        {
            return await _attendance.GetAllAttendance();
        }
    }
}
