using kul_locall_back_end.models.clerkSession;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace ClerkWebhookDemo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClerkWebhookController : ControllerBase
    {
        private readonly IClerkWebhookService _service;

        public ClerkWebhookController(IClerkWebhookService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IResult> Post([FromBody] JsonElement body)
        {
            var eventType = body.GetProperty("type").GetString();
            var dataRaw = body.GetProperty("data").GetRawText();

            switch (eventType)
            {
                case "user.created":
                    var userCreated = JsonSerializer.Deserialize<ClerkUserPayload>(dataRaw);
                    return await _service.HandleUserCreatedAsync(userCreated);
                    break;
                case "user.updated":
                    Console.WriteLine("Handling user updated event " + dataRaw);
                    var userUpdated = JsonSerializer.Deserialize<ClerkUserPayload>(dataRaw);
                    return await _service.HandleUserUpdatedAsync(userUpdated);
                    break;
                case "session.created":
                    var sessionCreated = JsonSerializer.Deserialize<ClerkSessionPayload>(dataRaw);
                    return await _service.HandleSessionCreatedAsync(sessionCreated);
                    break;
                case "session.updated":
                    var sessionUpdated = JsonSerializer.Deserialize<ClerkSessionPayload>(dataRaw);
                    return await _service.HandleSessionUpdatedAsync(sessionUpdated);
                    break;
                case "email.created":
                    var emailCreated = JsonSerializer.Deserialize<ClerkEmailPayload>(dataRaw);
                    return  await _service.HandleEmailCreatedAsync(emailCreated);
                    break;
                default:
                    return Results.BadRequest("Unsupported event type.");
            }

        }
    }
}
