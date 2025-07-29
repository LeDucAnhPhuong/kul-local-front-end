using kul_local_back_end.Entities;
using kul_locall_back_end.models.schedule;

namespace kul_local_back_end.Repository
{

    public interface ISchedule: IRepository<Schedule>
    {
        public Task<IResult> GetAllSchedule();

        public Task<IResult> CreateSchedule(CreateScheduleDTO scheduleDTO);

        public Task<IResult> UpdateSchedule(string id, UpdateScheduleDTO scheduleDTO);
        
        public Task<IResult> GetScheduleDateRange(DateTime startDate, DateTime endDate);

        public Task<IResult> GetPersonalDateRange(string email, DateTime startDate, DateTime endDate);

        Task<bool> IsScheduleConflictAsync(string scheduleId, string slotId, DateTime date);

        Task<IResult> DeletecSheduleAsync(string id);


    }
}

