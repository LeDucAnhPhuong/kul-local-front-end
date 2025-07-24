using kul_local_back_end.Entities;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;

public class CheckAttendanceRequest
{
    public string ClassId { get; set; } = null!;
    public string ScheduleId { get; set; } = null!;
    public List<StudentAttendanceDTO> Students { get; set; } = new();
}

public class StudentAttendanceDTO
{
    public string UserId { get; set; } = null!;

    [JsonConverter(typeof(JsonStringEnumConverter))]
    [BsonRepresentation(MongoDB.Bson.BsonType.String)]
    public AttendanceStatus Status { get; set; }
}