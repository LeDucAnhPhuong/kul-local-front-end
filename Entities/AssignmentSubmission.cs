using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace kul_local_back_end.Entities;

public class AssignmentSubmission : baseEntity
{
    [BsonElement("assignment_id")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string AssignmentId { get; set; }

    [BsonElement("content")]
    public string Content { get; set; } // File URL hoặc bài làm dạng link

    [BsonElement("submitted_at")]
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("score")]
    public double? Score { get; set; } // Coach chấm

    [BsonElement("feedback")]
    public string? Feedback { get; set; } // Coach nhận xét
}

public class AssignmentSubmissionResponse : AssignmentSubmission
{
    [BsonElement("assignment")]
    public AssignmentResponse Assignment { get; set; } // Thông tin bài tập
    [BsonElement("user")]
    public User User { get; set; } // Thông tin người nộp bài
}
