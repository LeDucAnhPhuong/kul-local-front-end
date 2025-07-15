using kul_local_back_end.Entities;
using MongoDB.Bson.Serialization.Attributes;

[BsonIgnoreExtraElements]
[BsonDiscriminator("Quiz")]
public class Quiz : baseEntity
{
    [BsonElement("title")]
    public string Title { get; set; }
    [BsonElement("date")]
    public DateTime Date { get; set; }        
    [BsonElement("due")]
    public DateTime Due { get; set; }     
    [BsonElement("isPublic")]
    public bool IsPublic { get; set; }      
}

public class  QuizResponsive: Quiz 
{
    [BsonElement("coach")]
    public User Coach { get; set; } // Coach who created the quiz
}