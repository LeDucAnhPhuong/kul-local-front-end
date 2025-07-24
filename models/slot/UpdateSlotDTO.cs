namespace kul_locall_back_end.models.slot
{
    public class UpdateSlotDTO
    {
        // Optional properties for slot updates
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }

        public string? Name { get; set; } = string.Empty;
    }
}
