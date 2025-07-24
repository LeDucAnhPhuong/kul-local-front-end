namespace kul_local_back_end.Models.Speaking
{
    public class CreateSpeakingDTO
    {
        public string Question { get; set; } = string.Empty;
        public string Answer { get; set; } = string.Empty;
        public int Score { get; set; }
    }
}
