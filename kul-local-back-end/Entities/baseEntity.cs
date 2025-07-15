using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace kul_local_back_end.Entities
{
    public class baseEntity
    {
        [BsonElement("_id")]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

        [BsonElement("createdAt")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("isActive")]
        public bool IsActive { get; set; } = true;

        [BsonElement("createdBy")]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string CreatedBy { get; set; } 

        [BsonElement("updatedBy")]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string UpdatedBy { get; set; }



    }
}
