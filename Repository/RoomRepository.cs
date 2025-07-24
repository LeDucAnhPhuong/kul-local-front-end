using kul_locall_back_end.Entities;
using kul_locall_back_end.models.room;
using kul_locall_back_end.repository;
using MongoDB.Driver;

namespace kul_local_back_end.Repository
{
    public class RoomRepository: BaseRepository<Room>, IRoom
    {
        public RoomRepository(IMongoDatabase database, string collection) : base(database, collection) { }

        public async Task<IResult> CreateRoomAsync(CreateRoomDTO room)
        {
            Room new_room = new Room()
            {
                Name = room.Name,
                Capacity = room.Capacity,
                Description = room.Description,
                Location = room.Location,

            };

            var result = await CreateAsync(new_room);
            return Results.Ok(new { data = result, message = "Created Room successfully" });
        }

        public async Task<IResult> DeleteRoomAsync(string id)
        {

            var existRoom = await GetByIdAsync(id);
            if (existRoom == null)
                return Results.BadRequest(new { message = "Room not avaiable" });

            var result = await DeleteAsync(id);
            return Results.Ok(new
            {
                data = result,
                message = "Deleted Room successfully"
            });
        }

        public async Task<IResult> GetAllRoomsAsync()
        {
            var result = await GetAllAsync();
            return Results.Ok(new {data = result, message = "Get All Room successfully"});
        }

        public async Task<IResult> GetRoomByIdAsync(string id)
        {
            var result = await GetByIdAsync(id);
            return Results.Ok(new { data = result, message = "Get Room by id successfully" });
        }

        public async Task<IResult> UpdateRoomAsync(string id, UpdateRoomDTO room)
        {
            var existRoom = await GetByIdAsync(id);
            if (existRoom == null)
                return Results.BadRequest(new { message = "Room not avaiable" });

            var result = await UpdateAsync(id, r =>
            {
                r.Name = room.Name ?? r.Name;
                r.Location = room.Location ?? r.Location;
                r.Capacity = room.Capacity ?? r.Capacity;
                r.Description = room.Description ?? r.Description;
            });

            return Results.Ok(new { data = result, message = "Updated Room successfully" });
        }
    }
}
