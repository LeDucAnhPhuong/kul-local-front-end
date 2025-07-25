using kul_local_back_end.Entities;
using System.Net.Http.Headers;
using System.Text.Json;
using static IClerkWebhookService;

namespace kul_local_back_end.Data
{
    public class ClerkApiClient : IClerkApiClient
    {
        private readonly HttpClient _http;
        private readonly string _apiKey;

        public ClerkApiClient(HttpClient httpClient, IConfiguration config)
        {
            _http = httpClient;
            _apiKey = config.GetConnectionString("CLERK_API_KEY");
            _http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
        }

        public async Task<ClerkUserDetails> GetUserAsync(string userId)
        {
            var users = await _http.GetFromJsonAsync<List<ClerkUserDetails>>(
                $"https://api.clerk.com/v1/users/{userId}");

            if (users == null)
            {
                Console.WriteLine($"User not found for Clerk ID: {userId}");
                return null;
            }

            return users?.FirstOrDefault();
        }

        public async Task RevokeSessionAsync(string sessionId)
        {
            await _http.PostAsync($"https://api.clerk.com/v1/sessions/{sessionId}/revoke", null);
        }

        public async Task RevokeAllSessionsAsync(string userId)
        {
            await _http.PostAsync($"https://api.clerk.com/v1/users/{userId}/sessions/revoke", null);
        }
    }

}
