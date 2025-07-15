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
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string ImageUrl { get; set; }
        public List<EmailAddressPayload> EmailAddresses { get; set; }
        public long CreatedAt { get; set; }
        public long UpdatedAt { get; set; }
    }

    public class EmailAddressPayload
    {
        public string EmailAddress { get; set; }
    }

    public class ClerkSessionPayload
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public long CreatedAt { get; set; }
        public long UpdatedAt { get; set; }
    }

    public class ClerkEmailPayload
    {
        public string Id { get; set; }
        public string RecipientEmail { get; set; }
        public string TemplateType { get; set; }
        public long CreatedAt { get; set; }
        public string Status { get; set; }
    }

}
