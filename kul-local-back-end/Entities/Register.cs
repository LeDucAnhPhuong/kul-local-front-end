using MongoDB.Bson.Serialization.Attributes;
using System.Runtime.Serialization;

namespace kul_local_back_end.Entities
{
    [BsonIgnoreExtraElements]
    [BsonDiscriminator("Register")]
    public class Register: baseEntity
    {
        [BsonElement("assign_id")]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string AssignId { get; set; } // ID of the user who assigned the registration

        [BsonElement("schedule_id")]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string ScheduleId { get; set; } // ID of the schedule this registration is for

        [BsonElement("status")]
        [BsonRepresentation(MongoDB.Bson.BsonType.String)]
        public RegisterStatus Status { get; set; }


    }
    public class RegisterResponse: Register
    {
        [BsonElement("assign_user")]
        public User? AssignUser { get; set; } // User who assigned the registration

        [BsonElement("schedule")]
        public ScheduleResponse Schedule { get; set; } // Schedule details for this registration

    }

    public enum RegisterStatus
    {
        [EnumMember(Value = "None")]
        None = 0,
        [EnumMember(Value = "Pending")]
        Pending = 1, 
        [EnumMember(Value = "Approved")]
        Approved = 2, 
        [EnumMember(Value = "Rejected")]
        Rejected = 3
    }
}
