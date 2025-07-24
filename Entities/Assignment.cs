using kul_locall_back_end.Entities;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Runtime.Serialization;

namespace kul_local_back_end.Entities;

public class Assignment : baseEntity
{
    [BsonElement("title")]
    public string Title { get; set; }

    [BsonElement("type")]
    [BsonRepresentation(BsonType.String)]
    public AssignmentType Type { get; set; }

    [BsonElement("class_id")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string ClassId { get; set; }

    [BsonElement("start_time")]
    public DateTime StartTime { get; set; }

    [BsonElement("due_time")]
    public DateTime DueTime { get; set; }

    [BsonElement("content")]
    public string Content { get; set; } // File URL
}

public class AssignmentResponse : Assignment
{
   [BsonElement("status_submission")]
    public string StatusSubmission { get; set; }

    [BsonElement("class")]
    public Class Class { get; set; } 
}

public enum AssignmentType
{
    [EnumMember(Value = "Check1")]
    Check1,
    [EnumMember(Value = "Check2")]
    Check2,
    [EnumMember(Value = "Essay")]
    Essay,
}
