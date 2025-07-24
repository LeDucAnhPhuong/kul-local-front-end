namespace kul_locall_back_end.models.schedule
{
    public class GenerateScheduleDTO
    {
        public List<string> DayofWeek { get; set; }
        public List<string> classId { get; set; } // ID of the class
    }
}
