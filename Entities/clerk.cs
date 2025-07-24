namespace kul_local_back_end.Entities
{
    public class UserCleark
    {
        public Guid Id { get; set; }
        public string ClerkId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string AvatarUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class Session
    {
        public Guid Id { get; set; }
        public string ClerkSessionId { get; set; }
        public string UserClerkId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class Email
    {
        public Guid Id { get; set; }
        public string ClerkEmailId { get; set; }
        public string RecipientEmail { get; set; }
        public string TemplateType { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class ClerkUserDetails
    {
        public string Id { get; set; }
        public string Object { get; set; }
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ImageUrl { get; set; }
        public long CreatedAt { get; set; }
        public long UpdatedAt { get; set; }

        public List<EmailAddressPayload> EmailAddresses { get; set; }
        public List<PhoneNumberPayload> PhoneNumbers { get; set; }
        public List<Web3WalletPayload> Web3Wallets { get; set; }

        public List<ExternalAccountPayload> ExternalAccounts { get; set; }
    }

    public class EmailAddressPayload
    {
        public string Id { get; set; }
        public string EmailAddress { get; set; }
        public VerificationPayload Verification { get; set; }
    }

    public class VerificationPayload
    {
        public string Status { get; set; } // "verified", "unverified"
        public long? VerifiedAtClient { get; set; }
        public long? VerifiedAt { get; set; }
    }

    public class PhoneNumberPayload
    {
        public string Id { get; set; }
        public string PhoneNumber { get; set; }
        public VerificationPayload Verification { get; set; }
    }

    public class Web3WalletPayload
    {
        public string Id { get; set; }
        public string Web3Wallet { get; set; }
        public VerificationPayload Verification { get; set; }
    }

    public class ExternalAccountPayload
    {
        public string Id { get; set; }
        public string Provider { get; set; }        // e.g., \"oauth_google\"
        public string ExternalId { get; set; }
        public VerificationPayload Verification { get; set; }
    }

}
