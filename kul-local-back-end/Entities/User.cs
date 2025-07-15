using MongoDB.Bson.Serialization.Attributes;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace kul_local_back_end.Entities
{
    [BsonIgnoreExtraElements]
    [BsonDiscriminator("users")]
    public class User: baseEntity
    {

        [BsonElement("profile_image")]
        public string ProfileImage { get; set; }

        [BsonElement("email")]
        public string Email { get; set; }
       
        [BsonElement("first_name")]
        public string FirstName { get; set; }

        [BsonElement("last_name")]
        public string LastName { get; set; }

        [BsonElement("class_id")]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string ClassId { get; set; }

        [BsonElement("role")]
        public string Role { get; set; }
    }

    public enum UserRole
    {
        [EnumMember(Value = "Admin")]
        Admin = 1,

        [EnumMember(Value = "Coach")]
        Coach = 2,

        [EnumMember(Value = "Student")]
        Student = 3,

        [EnumMember(Value = "Tedteam")]
        Tedteam = 4
    }
}
