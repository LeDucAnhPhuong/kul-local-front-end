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
        public async Task<IActionResult> Post([FromBody] JsonElement body)
        {
            var eventType = body.GetProperty("type").GetString();
            var dataRaw = body.GetProperty("data").GetRawText();

            switch (eventType)
            {
                case "user.created":
                    var userCreated = JsonSerializer.Deserialize<ClerkUserPayload>(dataRaw);
                    await _service.HandleUserCreatedAsync(userCreated);
                    break;
                case "user.updated":
                    var userUpdated = JsonSerializer.Deserialize<ClerkUserPayload>(dataRaw);
                    await _service.HandleUserUpdatedAsync(userUpdated);
                    break;
                case "session.created":
                    var sessionCreated = JsonSerializer.Deserialize<ClerkSessionPayload>(dataRaw);
                    await _service.HandleSessionCreatedAsync(sessionCreated);
                    break;
                case "session.updated":
                    var sessionUpdated = JsonSerializer.Deserialize<ClerkSessionPayload>(dataRaw);
                    await _service.HandleSessionUpdatedAsync(sessionUpdated);
                    break;
                case "email.created":
                    var emailCreated = JsonSerializer.Deserialize<ClerkEmailPayload>(dataRaw);
                    await _service.HandleEmailCreatedAsync(emailCreated);
                    break;
                default:
                    return BadRequest("Unsupported event type.");
            }

            return Ok();
        }
    }
}
