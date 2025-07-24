
using kul_local_back_end.Entities;

public interface IClerkApiClient
    {
        Task<ClerkUserDetails> GetUserAsync(string userId);
        Task RevokeSessionAsync(string sessionId);
        Task RevokeAllSessionsAsync(string userId);
    }
