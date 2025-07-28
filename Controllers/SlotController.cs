using kul_locall_back_end.models.slot;
using kul_locall_back_end.repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace kul_local_back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SlotController : ControllerBase
    {
        private readonly ISlot _repository_slot;
        public SlotController(ISlot repository)
        {
            _repository_slot = repository;
        }
        [HttpGet("slots")]
        public async Task<IResult> GetSlotsAsync()
        {
            var result = await _repository_slot.GetAllSlotsAsync();
            return result;
        }
        [HttpPost("create-slot")]
        public async Task<IResult> CreateSlotAsync(CreateSlotDTO slot)
        {
            var result = await _repository_slot.CreateSlotAsync(slot);
            return result;
        }

        [HttpGet("slot/{id}")]
        public async Task<IResult> GetSlotByIdAsync(string id)
        {
            var result = await _repository_slot.GetSlotByIdAsync(id);
            return result;
        }

        [HttpDelete("delete-slot/{id}")]
        public async Task<IResult> DeleteSlotAsync(string id)
        {
            var result = await _repository_slot.DeleteSlotAsync(id);
            return result;
        }

        [HttpPut("update-slot/{id}")]
        public async Task<IResult> UpdateSlotAsync(string id, UpdateSlotDTO slot)
        {
            var result = await _repository_slot.UpdateSlotAsync(id, slot);
            return result;
        }
    }
}
