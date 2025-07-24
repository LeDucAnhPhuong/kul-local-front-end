using MongoDB.Bson.Serialization.Attributes;
using System.Runtime.Serialization;

namespace kul_local_back_end.Entities
{
    [BsonIgnoreExtraElements]
    [BsonDiscriminator("attendance")]
    public class Attendance: baseEntity
    {
        [BsonElement("user_id")]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string UserId { get; set; }

        [BsonElement("schedule_id")]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string ScheduleId { get; set; }

        [BsonRepresentation(MongoDB.Bson.BsonType.String)]
        [BsonElement("status")]
        public AttendanceStatus Status { get; set; } 

    }

    public class AttendanceResponse : Attendance
    {
        [BsonElement("user")]
        public User User { get; set; } // Assuming User is another entity that contains user details
        [BsonElement("schedule")]
        public ScheduleResponse Schedule { get; set; } // Assuming Schedule is another entity that contains schedule details
    }

    public enum AttendanceStatus
    {
        [EnumMember(Value = "NotYet")]
        NotYet,
        [EnumMember(Value = "Present")]
        Present,
        [EnumMember(Value = "Absent")]
        Absent
    }
}
