using System.Text.Json.Serialization;

namespace kul_locall_back_end.models.clerkSession
{
    public class WebhookEvent<T>
    {
        public string Object { get; set; }
        public string Type { get; set; }
        public long Timestamp { get; set; }
        public string InstanceId { get; set; }
        public T Data { get; set; }
    }

    public class ClerkUserPayload
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }
        [JsonPropertyName("first_name")]
        public string FirstName { get; set; }
        [JsonPropertyName("last_name")]
        public string LastName { get; set; }
        [JsonPropertyName("username")]
        public string Username { get; set; }
        [JsonPropertyName("image_url")]
        public string ImageUrl { get; set; }

        [JsonPropertyName("email_addresses")]
        public List<EmailAddressPayload> EmailAddresses { get; set; }
        public long CreatedAt { get; set; }
        public long UpdatedAt { get; set; }
    }

    public class EmailAddressPayload
    {
        [JsonPropertyName("email_address")]
        public string EmailAddress { get; set; }
    }

    public class ClerkSessionPayload
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }
        [JsonPropertyName("user_id")]
        public string UserId { get; set; }
        [JsonPropertyName("created_at")]
        public long CreatedAt { get; set; }
        [JsonPropertyName("updated_at")]
        public long UpdatedAt { get; set; }
    }

    public class ClerkEmailPayload
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }
        [JsonPropertyName("recipient_email")]
        public string RecipientEmail { get; set; }
        [JsonPropertyName("template_type")]
        public string TemplateType { get; set; }
        [JsonPropertyName("created_at")]
        public long CreatedAt { get; set; }
        [JsonPropertyName("status")]
        public string Status { get; set; }
    }

}
