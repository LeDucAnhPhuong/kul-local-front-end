namespace kul_locall_back_end.models.schedule
{
    public class CreateScheduleDTO
    {
        public DateTime Date { get; set; } // Date in "yyyy-MM-dd" format
        public string RoomId { get; set; } // ID of the room
        public string SlotIds { get; set; } // List of slot IDs
        public string classId { get; set; } // ID of the class
        public string CoachEmail { get; set; } // ID of the coach
    }
}
