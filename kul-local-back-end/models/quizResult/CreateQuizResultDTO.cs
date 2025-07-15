using kul_local_back_end.Entities;

namespace kul_local_back_end.models.quizResult
{
    public class CreateQuizResultDTO
    {
        public string QuizId { get; set; }
        public List<AnswerSubmission> Answers { get; set; } = new();
    }
}
