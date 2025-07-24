using kul_locall_back_end.models.clerkSession;

    public interface IClerkWebhookService
    {
        Task HandleUserCreatedAsync(ClerkUserPayload payload);
        Task HandleUserUpdatedAsync(ClerkUserPayload payload);
        Task HandleSessionCreatedAsync(ClerkSessionPayload payload);
        Task HandleSessionUpdatedAsync(ClerkSessionPayload payload);
        Task HandleEmailCreatedAsync(ClerkEmailPayload payload);
    }

