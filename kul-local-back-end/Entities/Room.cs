using kul_local_back_end.Entities;
using MongoDB.Bson.Serialization.Attributes;

namespace kul_locall_back_end.Entities
{
    [BsonIgnoreExtraElements]
    [BsonDiscriminator("Room")]

    public class Room : baseEntity
    {
        [BsonElement("name")]
        public string Name { get; set; }
        [BsonElement("capacity")]
        public int Capacity { get; set; }
        [BsonElement("location")]
        public string Location { get; set; }

        [BsonElement("description")]
        public string Description { get; set; }

    }
}
