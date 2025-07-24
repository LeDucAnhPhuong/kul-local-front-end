using kul_locall_back_end.Entities;
using kul_locall_back_end.models.slot;
using kul_locall_back_end.repository;
using MongoDB.Driver;

namespace kul_local_back_end.Repository
{
    public class SlotRepository: BaseRepository<Slot>, ISlot
    {
        public SlotRepository(IMongoDatabase database, string collection) : base(database, collection)
        {
        }

        public async Task<IResult> CreateSlotAsync(CreateSlotDTO slot)
        {
            if (slot.EndTime <= slot.StartTime)
            {
                return Results.BadRequest(new { message = "End time must be after start time" });
            }

            var today = DateTime.Today;

            var existingSlots = await GetAllAsync();
            foreach (var existingSlot in existingSlots)
            {
                var existingStartTimeParts = existingSlot.StartTime.Split(':');
                var existingEndTimeParts = existingSlot.EndTime.Split(':');

                var existingStartTime = new DateTime(
                    slot.StartTime.Year, slot.StartTime.Month, slot.StartTime.Day,
                    int.Parse(existingStartTimeParts[0]), int.Parse(existingStartTimeParts[1]), 0);

                var existingEndTime = new DateTime(
                    slot.EndTime.Year, slot.EndTime.Month, slot.EndTime.Day,
                    int.Parse(existingEndTimeParts[0]), int.Parse(existingEndTimeParts[1]), 0);

                if ((slot.StartTime < existingEndTime && slot.EndTime > existingStartTime) || (slot.StartTime > existingStartTime && slot.StartTime < existingEndTime) || ( slot.EndTime > existingStartTime && slot.EndTime < existingEndTime) )
                {
                    return Results.BadRequest(new { message = $"Slot overlaps with existing slot '{existingSlot.Name}' ({existingSlot.StartTime} - {existingSlot.EndTime})" });
                }
            }

            string startTimeString = slot.StartTime.ToString("HH:mm");
            string endTimeString = slot.EndTime.ToString("HH:mm");

            var newSlot = new Slot
            {
                Name = slot.Name,
                StartTime = startTimeString,
                EndTime = endTimeString,
            };
            var createdSlot = await CreateAsync(newSlot);
            return Results.Ok(new { data = createdSlot, message = "Slot created successfully" });
        }

        public async Task<IResult> DeleteSlotAsync(string id)
        {
           
            var existingSlot = GetByIdAsync(id).Result;
            if (existingSlot == null)
            {
                return Results.NotFound(new { message = "Slot not found" });
            }
            var result = await DeleteAsync(id);
            return Results.Ok(new { data = result, message = "Slot deleted successfully" });

        }

        public async Task<IResult> GetAllSlotsAsync()
        {
            
            var slots = await GetAllAsync();
            if (slots == null || !slots.Any())
            {
                return Results.NotFound(new { message = "No slots found" });
            }
            return Results.Ok(new { data = slots, message = "Slots retrieved successfully" });
        }

        public async Task<IResult> GetSlotByIdAsync(string id)
        {
         
            var slot = await GetByIdAsync(id);
                if (slot == null)
                {
                    return Results.NotFound(new { message = "Slot not found" });
                }
                return Results.Ok(new { data = slot, message = "Slot retrieved successfully" });
        }

        public async Task<IResult> UpdateSlotAsync(string id, UpdateSlotDTO slot)
        {
            
            var existingSlot = await GetByIdAsync(id);
            if (existingSlot == null)
            {
                return Results.NotFound(new { message = "Slot not found" });
            }
            if (slot.EndTime <= slot.StartTime)
            {
                return Results.BadRequest(new { message = "End time must be after start time" });
            }
            var existingSlots = await GetAllAsync();
            
            if((slot.StartTime != null && slot.EndTime == null) || (slot.StartTime == null && slot.EndTime != null))
            {
               return Results.BadRequest(new { message = "Both start time and end time must be provided" });
            }
            
            if(slot.StartTime == null && slot.EndTime == null)
            {
                await UpdateAsync(id, s =>
                {
                    s.Name = slot.Name ?? s.Name;
                });
                return Results.Ok(new { message = "Slot updated successfully" });
            }

            var startTime = slot.StartTime ?? DateTime.UtcNow;
            var endTime = slot.EndTime ?? DateTime.UtcNow.AddHours(1); 

            foreach (var existing in existingSlots)
            {
                if (existing.Id != id) // Skip the current slot
                {
                    var existingStartTimeParts = existing.StartTime.Split(':');
                    var existingEndTimeParts = existing.EndTime.Split(':');
                    var existingStartTime = new DateTime(
                        startTime.Year, startTime.Month, startTime.Day,
                        int.Parse(existingStartTimeParts[0]), int.Parse(existingStartTimeParts[1]), 0);
                    var existingEndTime = new DateTime(
                        endTime.Year, endTime.Month, endTime.Day,
                        int.Parse(existingEndTimeParts[0]), int.Parse(existingEndTimeParts[1]), 0);
                    if (slot.StartTime < existingEndTime && slot.EndTime > existingStartTime)
                    {
                        return Results.BadRequest(new { message = $"Slot overlaps with existing slot '{existing.Name}' ({existing.StartTime} - {existing.EndTime})" });
                    }
                }
            }
            string startTimeString = startTime.ToString("HH:mm");
            string endTimeString = endTime.ToString("HH:mm");
            await UpdateAsync(id, s =>
            {
                s.Name = slot.Name ?? s.Name;
                s.StartTime = startTimeString;
                s.EndTime = endTimeString;
            });
            return Results.Ok(new { message = "Slot updated successfully" });

        }
    }
   
}
