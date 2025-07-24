namespace kul_locall_back_end.models.room
{
    public class UpdateRoomDTO
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Location { get; set; }
        public int? Capacity { get; set; }
    }

}
