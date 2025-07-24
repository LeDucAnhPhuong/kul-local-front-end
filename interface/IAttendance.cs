using kul_local_back_end.Entities;
using kul_locall_back_end.Entities;
using kul_locall_back_end.models.attendance;

namespace kul_locall_back_end
{
    public interface IAttendance : IRepository<Attendance>
    {
        public Task<IResult> GetPersonalAttendance(string email, DateTime startDate, DateTime endDate);


        public Task<IResult> CheckAttendanceAsync(CheckAttendanceRequest request, string email);

        public Task<IResult> GetAllAttendance();
    }
}
