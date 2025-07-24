using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace kul_local_back_end.Entities
{
    [BsonIgnoreExtraElements]
    public class Speaking : baseEntity
    {
        [BsonElement("question")]
        public string Question { get; set; } = string.Empty;

        [BsonElement("answer")]
        public string Answer { get; set; } = string.Empty;

        [BsonElement("score")]
        public int Score { get; set; }
    }
}
