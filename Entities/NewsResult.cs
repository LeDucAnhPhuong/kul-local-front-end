using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace kul_local_back_end.Entities
{
    public class NewsResult : baseEntity
    {
        [BsonElement("news_id")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string NewsId { get; set; } = null!;

        [BsonElement("score")]
        public double Score { get; set; }

        [BsonElement("feedback")]
        public string Feedback { get; set; } = string.Empty;

    }
}
