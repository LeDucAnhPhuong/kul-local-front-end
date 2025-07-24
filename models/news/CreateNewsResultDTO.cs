namespace kul_local_back_end.models.news
{
    public class CreateNewsResultDTO
    {
        public string NewsId { get; set; } = null!;
        public double Score { get; set; }
        public string Feedback { get; set; } = string.Empty;
    }
}
