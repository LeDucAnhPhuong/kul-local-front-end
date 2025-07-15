namespace kul_locall_back_end.models.slot
{
    public class CreateSlotDTO
    {
        public string Name { get; set; } = string.Empty;
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }
}
