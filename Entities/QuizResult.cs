using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace kul_local_back_end.Entities
{
    public class QuizResult : baseEntity
    {
        [BsonElement("quiz_id")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string QuizId { get; set; }

        [BsonElement("user_id")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; }

        [BsonElement("submitted_at")]
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("score")]
        public double Score { get; set; }

        [BsonElement("answers")]
        public List<AnswerSubmission> Answers { get; set; } = new();
    }

    public class AnswerSubmission
    {
        [BsonElement("question_id")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string QuestionId { get; set; }

        // Dùng cho SingleChoice
        [BsonElement("selected_option")]
        public string? SelectedOption { get; set; }

        // Dùng cho MultipleChoice
        [BsonElement("selected_options")]
        public List<string>? SelectedOptions { get; set; } = new();

        // Dùng cho MatchPairs
        [BsonElement("matched_pairs")]
        public List<PairMatch>? MatchedPairs { get; set; } = new();

        // Dùng cho SelectInText hoặc FillBlank
        [BsonElement("text_answers")]
        public List<string>? TextAnswers { get; set; } = new(); // placeholder -> answer
    }

    public class PairMatch
    {
        public string Left { get; set; }
        public string Right { get; set; }
    }
}
