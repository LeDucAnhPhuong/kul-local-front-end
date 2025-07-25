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

        public async Task<IResult> HandleUserCreatedAsync(ClerkUserPayload payload)
        {
            var email = payload.EmailAddresses.FirstOrDefault()?.EmailAddress;
            if (string.IsNullOrWhiteSpace(email)) return Results.BadRequest("Email is required.");

            bool allowed = await _userRepo.isEmailExits(email);
            if (!allowed)
            {
                await _clerkApi.RevokeAllSessionsAsync(payload.Id);
                return Results.BadRequest("Email not allowed or not pre-registered.");
            }

            var user = await _userRepo.GetUserByEmail(email);
            if (user == null) return Results.NotFound("User not found in system.");


            await _userRepo.UpdateAsync(user.Id, user =>
            {
                user.FirstName = payload.FirstName ?? user.FirstName;
                user.LastName = payload.LastName ?? user.LastName;
                user.ProfileImage = payload.ImageUrl ?? user.ProfileImage;
            });
            return Results.Ok();
        }

        public async Task<IResult> HandleSessionCreatedAsync(ClerkSessionPayload payload)
        {
            // 🔎 Lấy thông tin chi tiết từ Clerk
            var userDetails = await _clerkApi.GetUserAsync(payload.UserId);

            if (userDetails == null || userDetails.EmailAddresses == null)
            {
                Console.WriteLine($"❌ Clerk user not found or missing emails for userId: {payload.UserId}");
                await _clerkApi.RevokeSessionAsync(payload.Id);
                return Results.BadRequest("Clerk user not found or missing emails.");
            }

            var email = userDetails.EmailAddresses.FirstOrDefault()?.EmailAddress;
            if (string.IsNullOrWhiteSpace(email))
            {
                Console.WriteLine($"❌ No email found for userId: {payload.UserId}");
                await _clerkApi.RevokeSessionAsync(payload.Id);
                return Results.BadRequest("No email found for user.");
            }

            // ✅ Kiểm tra user có được phép (có trong hệ thống hay không)
            bool allowed = await _userRepo.isEmailExits(email);
            if (!allowed)
            {
                Console.WriteLine($"❌ Email not allowed or not pre-registered: {email}");
                await _clerkApi.RevokeSessionAsync(payload.Id);
                return Results.BadRequest("Email not allowed or not pre-registered.");
            }

            // 🔄 Lấy user hệ thống để cập nhật
            var user = await _userRepo.GetUserByEmail(email);
            if (user == null)
            {
                Console.WriteLine($"❌ Email exists in system but GetUserByEmail failed: {email}");
                return Results.NotFound("User not found in system.");
            }

            // ✏️ Cập nhật thông tin từ Clerk
            await _userRepo.UpdateAsync(user.Id, u =>
            {
                u.FirstName = userDetails.FirstName ?? u.FirstName;
                u.LastName = userDetails.LastName ?? u.LastName;
                u.ProfileImage = userDetails.ImageUrl ?? u.ProfileImage;
            });

            return Results.Ok(new { message = "Session created and user updated successfully." });
        }

        public async Task<IResult> HandleUserUpdatedAsync(ClerkUserPayload payload)
        {

            var userCelrk = payload.EmailAddresses.FirstOrDefault();
            if (userCelrk == null) return Results.BadRequest("Email is required.");

            Console.WriteLine($"🔄 Handling user updated for Clerk ID: {userCelrk?.EmailAddress}");
            var email = userCelrk?.EmailAddress;

            var user = await _userRepo.GetUserByEmail(email);
            if (user == null) return Results.NotFound("User not found in system.");

            await _userRepo.UpdateAsync(user.Id, u =>
            {
                u.FirstName = payload.FirstName ?? u.FirstName;
                u.LastName = payload.LastName ?? u.LastName;
                u.ProfileImage = payload.ImageUrl ?? u.ProfileImage;
            });

            return Results.Ok(new { message = "User updated" });
            }

        public async Task<IResult> HandleSessionUpdatedAsync(ClerkSessionPayload payload)
        {
            var userDetails = await _clerkApi.GetUserAsync(payload.UserId);
            if (userDetails == null || userDetails.EmailAddresses == null) return Results.BadRequest("User details not found.");

            var email = userDetails.EmailAddresses.FirstOrDefault()?.EmailAddress;
            if (string.IsNullOrWhiteSpace(email)) return Results.BadRequest("Email is required.");

            var exists = await _userRepo.isEmailExits(email);
            if (!exists)
            {
                await _clerkApi.RevokeSessionAsync(payload.Id); // session bị từ chối
            }
            return Results.Ok(new { message = "Session updated successfully." });
        }
        public async Task<IResult> HandleEmailCreatedAsync(ClerkEmailPayload payload){
            return Results.Ok(); 
        }

    }
}
