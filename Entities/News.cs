using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace kul_local_back_end.Entities
{
    public class News : baseEntity
    {
        [BsonElement("title")]
        public string Title { get; set; } = null!;


        [BsonElement("image_url")]
        public string ImageUrl { get; set; } = null!;


        [BsonElement("content")]
        public string Content { get; set; } = null!;

        [BsonElement("coach_id")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string CoachId { get; set; } = null!;
    }

    public class NewsResponse: News{
        [BsonElement("result")]
        public NewsResult? Result { get; set; } = null!;
    }


}
