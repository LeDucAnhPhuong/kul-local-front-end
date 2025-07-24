using kul_local_back_end.Entities;

namespace kul_local_back_end.models.question
{
    public class CreateQuestionDTO
    {
        public string QuizId { get; set; }
        public QuestionType Type { get; set; } 
        public string QuestionText { get; set; }
        public MultipleChoiceOption? Options { get; set; } = new();
        public PairOption? Pairs { get; set; } = new();
        public SelectContent? SelectContent { get; set; } = new();
        public FillBlank? FillInBlank { get; set; } = new();
    }


}
