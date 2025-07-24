using kul_locall_back_end.Entities;
using kul_locall_back_end.models.room;

namespace kul_locall_back_end.repository
{
    public interface IRoom : IRepository<Room>
    {
        Task<IResult> GetRoomByIdAsync(string id);
        Task<IResult> GetAllRoomsAsync();
        Task<IResult> CreateRoomAsync(CreateRoomDTO room);
        Task<IResult> UpdateRoomAsync(string id, UpdateRoomDTO room);
        Task<IResult> DeleteRoomAsync(string id);
    }
}
