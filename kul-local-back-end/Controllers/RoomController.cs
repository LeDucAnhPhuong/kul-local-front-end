using kul_locall_back_end.models.room;
using kul_locall_back_end.repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace kul_local_back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomController : ControllerBase
    {
        private readonly IRoom _roomRepository;
        public RoomController (IRoom room)
        {
            _roomRepository = room;
        }

        [HttpGet()]
        public async Task<IResult> getAllRoom()
        {
            return await _roomRepository.GetAllRoomsAsync();
        }

        [HttpGet("{id}")]
        public async Task<IResult> getById(string id)
        {
            return await _roomRepository.GetRoomByIdAsync(id);
        }

        [HttpPost()]
        public async Task<IResult> createRoom(CreateRoomDTO createRoomDTO) {
        
            return await _roomRepository.CreateRoomAsync(createRoomDTO);
        }

        [HttpDelete()]
        public async Task<IResult> deleteRoom(string id) {
            return await _roomRepository.DeleteRoomAsync(id);
        }

    }
}
