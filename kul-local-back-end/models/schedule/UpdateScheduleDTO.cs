namespace kul_locall_back_end.models.schedule
{
    public class UpdateScheduleDTO
    {
        public string? Id { get; set; } // ID of the schedule
        public DateTime? Date { get; set; } // Date in "yyyy-MM-dd" format
        public string? RoomId { get; set; } // ID of the room
        public string? SlotId { get; set; } // List of slot IDs
        public string? CoachId { get; set; } // ID of the coach
        public string? classId { get; set; } // ID of the class

        public string? tedteamId { get; set; } // ID of the TED team
    }
}
