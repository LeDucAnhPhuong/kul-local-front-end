using kul_local_back_end.Entities;
using MongoDB.Bson.Serialization.Attributes;

namespace kul_locall_back_end.Entities
{
    [BsonIgnoreExtraElements]
    [BsonDiscriminator("Slot")]
    public class Slot : baseEntity
    {

        [BsonElement("name")]
        public string Name { get; set; }

        [BsonElement("start_time")]
        public string StartTime { get; set; }

        [BsonElement("end_time")]
        public string EndTime { get; set; }


    }
}
