using kul_locall_back_end.Entities;
using kul_locall_back_end.models.slot;

namespace kul_locall_back_end.repository
{
    public interface ISlot : IRepository<Slot>
    {
        Task<IResult> GetSlotByIdAsync(string id);
        Task<IResult> GetAllSlotsAsync();
        Task<IResult> CreateSlotAsync(CreateSlotDTO slot);
        Task<IResult> UpdateSlotAsync(string id, UpdateSlotDTO slot);
        Task<IResult> DeleteSlotAsync(string id);
    }
}
