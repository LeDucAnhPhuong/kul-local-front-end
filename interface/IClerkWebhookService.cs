using kul_locall_back_end.models.clerkSession;

    public interface IClerkWebhookService
    {
    Task<IResult> HandleUserCreatedAsync(ClerkUserPayload payload);
    Task<IResult> HandleUserUpdatedAsync(ClerkUserPayload payload);
    Task<IResult> HandleSessionCreatedAsync(ClerkSessionPayload payload);
    Task<IResult> HandleSessionUpdatedAsync(ClerkSessionPayload payload);
    Task<IResult> HandleEmailCreatedAsync(ClerkEmailPayload payload);
    }

