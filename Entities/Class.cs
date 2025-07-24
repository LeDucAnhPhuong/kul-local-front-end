using kul_local_back_end.Entities;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace kul_locall_back_end.Entities
{

    [BsonIgnoreExtraElements]
    [BsonDiscriminator("Class")]

    public class Class : baseEntity
    {
        [BsonElement("name")]
        public string Name { get; set; }

        [BsonElement("start_time")]
        public DateTime StartTime { get; set; }

        [BsonElement("end_time")]
        public DateTime EndTime { get; set; }


    }

    public class ClassMember: Class
    {
        public List<User> users { get; set; }

    }
}
