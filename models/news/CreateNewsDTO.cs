namespace kul_local_back_end.models.news
{
    public class CreateNewsDTO
    {
        public string Title { get; set; } = null!;
        public string? ImageUrl { get; set; } = null!;
        public string Content { get; set; } = null!;
    }

    public class UpdateNewsDTO  {
        public string? Title { get; set; } = null!;
        public string? ImageUrl { get; set; } = null!;
        public string? Content { get; set; } = null!;
    }
}
