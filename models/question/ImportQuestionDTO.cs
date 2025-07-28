namespace kul_local_back_end.models.question
{
    public class ImportQuestionDTO
    {
        public IFormFile File { get; set; } = null!;
        public string QuizId { get; set; } = null!;
    }

}
