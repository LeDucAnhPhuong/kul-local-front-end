using kul_local_back_end.Entities;
using kul_locall_back_end.models.clerkSession;
using kul_locall_back_end.repository;
using System;

namespace kul_local_back_end.Repository
{
    public class ClerkWebhookService : IClerkWebhookService
    {
        private readonly IUserRepository _userRepo;
        private readonly IClerkApiClient _clerkApi;

        public ClerkWebhookService(IUserRepository userRepo, IClerkApiClient clerkApi)
        {
            _userRepo = userRepo;
            _clerkApi = clerkApi;
        }

        public async Task HandleUserCreatedAsync(ClerkUserPayload payload)
        {
            var email = payload.EmailAddresses.FirstOrDefault()?.EmailAddress;
            if (string.IsNullOrWhiteSpace(email)) return;

            bool allowed = await _userRepo.isEmailExits(email);
            if (!allowed)
            {
                await _clerkApi.RevokeAllSessionsAsync(payload.Id);
                return;
            }

            var user = await _userRepo.GetUserByEmail(email);
            if (user == null) return;


            await _userRepo.UpdateAsync(user.Id, user =>
            {
                user.FirstName = payload.FirstName ?? user.FirstName;
                user.LastName = payload.LastName ?? user.LastName;
                user.ProfileImage = payload.ImageUrl ?? user.ProfileImage;
            });
        }

        public async Task HandleSessionCreatedAsync(ClerkSessionPayload payload)
        {
            var userDetails = await _clerkApi.GetUserAsync(payload.UserId);
            var email = userDetails.EmailAddresses.FirstOrDefault()?.EmailAddress;
            if (string.IsNullOrWhiteSpace(email)) return;

            bool allowed = await _userRepo.isEmailExits(email);
            if (!allowed)
            {
                await _clerkApi.RevokeSessionAsync(payload.Id);
                return;
            }

            var user = await _userRepo.GetUserByEmail(email);
            if (user == null) return;

            await _userRepo.UpdateAsync(user.Id, user =>
            {
                user.FirstName = userDetails.FirstName ?? user.FirstName;
                user.LastName = userDetails.LastName ?? user.LastName;
                user.ProfileImage = userDetails.ImageUrl ?? user.ProfileImage;
            });
        }

        public Task HandleUserUpdatedAsync(ClerkUserPayload payload) => Task.CompletedTask;
        public Task HandleSessionUpdatedAsync(ClerkSessionPayload payload) => Task.CompletedTask;
        public Task HandleEmailCreatedAsync(ClerkEmailPayload payload) => Task.CompletedTask;
    }
}
