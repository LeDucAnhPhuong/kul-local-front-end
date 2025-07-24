using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace kul_local_back_end.Entities
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum QuestionType
    {
        [EnumMember(Value = "SingleChoice")]
        SingleChoice,

        [EnumMember(Value = "MultipleChoice")]
        MultipleChoice,

        [EnumMember(Value = "SelectInText")]
        SelectInText,

        [EnumMember(Value = "PairKey")]
        PairKey,

        [EnumMember(Value = "Fillblank")]
        Fillblank
    }

    public class Question: baseEntity
    {

        [BsonElement("quiz_id")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string QuizId { get; set; }

        [BsonElement("type")]
        [BsonRepresentation(BsonType.String)]
        public QuestionType Type { get; set; }

        [BsonElement("question")]
        public string QuestionText { get; set; }

        [BsonElement("options")]
        public MultipleChoiceOption? Options { get; set; } = new();

        // Dùng cho MatchPairs
        [BsonElement("pairs")]
        public PairOption? Pairs { get; set; } = new();

        [BsonElement("fill_in_blank")]
        public FillBlank? FillInBlank { get; set; } = new();

        [BsonElement("select_content")]
        public SelectContent? SelectContent { get; set; } = new();
    }

    public class FillBlank
    {
        public string? content { get; set; }
        public List<string>? CorrectAnswers { get; set; }
    }


    public class MultipleChoiceOption
    {
        public List<string>? Option { get; set; }
        public List<string>? CorrectAnswers { get; set; } = new();
    }

    public class PairOption
    {
        public List<string>? Left { get; set; }
        public List<string>? Right { get; set; }

        public List<List<string>>? CorrectAnswers { get; set; } = new();
    }
    public class SelectContent
    {
        public string? Content { get; set; }
        public List<SelectPlaceholder>? Options { get; set; } = new();

    }

    public class SelectPlaceholder
    {
        public List<string>? value { get; set; } = new();
        public string? CorrectAnswer { get; set; }
    }
}
