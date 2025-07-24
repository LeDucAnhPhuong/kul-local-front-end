using kul_local_back_end.Repository;
using kul_locall_back_end.models.schedule;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace kul_local_back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScheduleController : ControllerBase
    {
        private ISchedule _scheduleRepository;
        public ScheduleController(ISchedule scheduleRepository)
        {
            _scheduleRepository = scheduleRepository;
        }

        [HttpGet()]
        public async Task<IResult> GetAll()
        {
            return await _scheduleRepository.GetAllSchedule();
        }

        [HttpGet("schedules/personal/date-range")]
        [Authorize]
        public async Task<IResult> GetPersonalDateRange(DateTime startDate, DateTime endDate)
        {

            var user = HttpContext.User;
            var email = user.FindFirst("user_email")?.Value;

            return await _scheduleRepository.GetPersonalDateRange(email, startDate, endDate);
        }

        [HttpGet("date-range")]
        public async Task<IResult> GetDateRange(DateTime startDate, DateTime endDate)
        {
            return await _scheduleRepository.GetScheduleDateRange(startDate, endDate);
        }

        [HttpPost()]
        public async Task<IResult> CreateSchedule( CreateScheduleDTO scheduleDTO)
        {
            return await _scheduleRepository.CreateSchedule(scheduleDTO);
        }

        [HttpPut("{id}")]
        public async Task<IResult> UpdateSchedule(string id, UpdateScheduleDTO scheduleDTO)
        {
            return await _scheduleRepository.UpdateSchedule(id, scheduleDTO);
        }
    }
}
