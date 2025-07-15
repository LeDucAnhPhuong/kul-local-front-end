using kul_locall_back_end.Entities;
using MongoDB.Bson.Serialization.Attributes;

namespace kul_local_back_end.Entities
{
    [BsonIgnoreExtraElements]
    [BsonDiscriminator("Schedule")]
    public class Schedule: baseEntity
    {
        [BsonElement("room_id")]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string RoomId { get; set; }

        [BsonElement("slot_id")]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string SlotId { get; set; }

        [BsonElement("class_id")]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string ClassId { get; set; }

        [BsonElement("tedteam_id")]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string TedTeamId { get; set; }

        [BsonElement("date")]
        public DateTime Date { get; set; }
        
        [BsonElement("coach_id")]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string CoachId { get; set; }

        [BsonElement("note")]
        public string Note { get; set; }
    }

    public class ScheduleResponse : Schedule
    {
        [BsonElement("room")]
        public Room Room { get; set; }

        [BsonElement("slot")]
        public Slot Slot { get; set; }

        [BsonElement("class")]
        public Class ClassInfor { get; set; }

        [BsonElement("tedteam")]
        public User TedTeam { get; set; }

        [BsonElement("coach")]
        public User Coach { get; set; }
    }
}
