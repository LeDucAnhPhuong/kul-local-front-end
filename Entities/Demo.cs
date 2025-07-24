using kul_local_back_end.Entities;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace kul_locall_back_end.Entities
{
    public class Demo : baseEntity
    {

        [BsonElement("name"), BsonRepresentation(BsonType.String)]

        public string name { get; set; }
        [BsonElement("categories"), BsonRepresentation(BsonType.String)]
        public string categories { get; set; }
    }
}
