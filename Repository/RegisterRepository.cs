using kul_local_back_end.Entities;
using kul_local_back_end.Repository;
using kul_locall_back_end;
using kul_locall_back_end.models.register;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;

namespace kul_local_back_end.Repositories
{
    public class RegisterRepository : BaseRepository<Register>, IRegister
    {
        private readonly IMongoCollection<User> _users;
        private readonly ScheduleRepository _schedules_repository;
        private readonly IMongoCollection<Schedule> _schedules;
        private readonly IMongoCollection<Attendance> _attendance;

        public RegisterRepository(IMongoDatabase db, string collectionName, ScheduleRepository scheduleRepository) : base(db, collectionName)
        {
            _users = db.GetCollection<User>("users");
            _schedules_repository = scheduleRepository;
            _schedules = db.GetCollection<Schedule>("schedule");
            _attendance = db.GetCollection<Attendance>("attendance");
        }

        public async Task<IResult> GetRegisterTedTeam(string assignEmail)
        {
            var today = DateTime.UtcNow.Date;
            int daysUntilNextMonday = ((int)DayOfWeek.Monday - (int)today.DayOfWeek) % 7;
            if (daysUntilNextMonday == 0) daysUntilNextMonday = 7; 
            var startDate = today.AddDays(daysUntilNextMonday);
            var endDate = startDate.AddDays(6);
            

            var user = await _users.Find(u => u.Email == assignEmail).FirstOrDefaultAsync();
            if (user == null)
                return Results.NotFound(new { message = "User not found." });

            var schedulesFilter = Builders<Schedule>.Filter.And(
                Builders<Schedule>.Filter.Gte(s => s.Date, startDate),
                Builders<Schedule>.Filter.Lte(s => s.Date, endDate),
                Builders<Schedule>.Filter.Or(
                    Builders<Schedule>.Filter.Eq(s => s.TedTeamId, null),
                    Builders<Schedule>.Filter.Eq(s => s.TedTeamId, user.Id)
                )
            );

            var schedules = await _schedules_repository.GetPopulatedSchedulesAsync(schedulesFilter);
            var scheduleIds = schedules.Select(s => s.Id).ToList();

            var registerFilter = Builders<Register>.Filter.And(
                Builders<Register>.Filter.In(r => r.ScheduleId, scheduleIds),
                Builders<Register>.Filter.Eq(r => r.AssignId, user.Id)
            );

            var registers = await _collection.Find(registerFilter).ToListAsync();
            var registerDict = registers.ToDictionary(r => r.ScheduleId, r => r.Status);

            var results = schedules.Select(s => new RegisterResponse
            {
                Schedule = new ScheduleResponse
                {
                    Id = s.Id,
                    RoomId = s.RoomId,
                    SlotId = s.SlotId,
                    ClassId = s.ClassId,
                    TedTeamId = s.TedTeamId,
                    CoachId = s.CoachId,
                    Note = s.Note,
                    Room = s.Room,
                    Slot = s.Slot,
                    ClassInfor = s.ClassInfor,
                    Date = s.Date
                },
                ScheduleId = s.Id,
                Status = registerDict.ContainsKey(s.Id) ? registerDict[s.Id] : RegisterStatus.None,
            }).ToList();

            return Results.Ok(new { data = results });
        }

        public async Task<IResult> RegisterTedTeamAsync(RegisterTedTeamDTO dto, string email)
        {
            var user = await _users.Find(u => u.Email == email).FirstOrDefaultAsync();
            if (user == null) return Results.NotFound(new { message = "User not found." });

            var newRegisters = new List<Register>();
            foreach (var scheduleId in dto.scheduleId)
            {
                var exists = await _collection.Find(r =>
                    r.AssignId == user.Id &&
                    r.ScheduleId == scheduleId).FirstOrDefaultAsync();

                if (exists == null)
                {
                    newRegisters.Add(new Register
                    {
                        AssignId = user.Id,
                        ScheduleId = scheduleId,
                        Status = RegisterStatus.Pending
                    });
                }
                else if (exists.Status == RegisterStatus.None)
                {
                    var filter = Builders<Register>.Filter.Eq(r => r.Id, exists.Id);
                    var update = Builders<Register>.Update.Set(r => r.Status, RegisterStatus.Pending);
                    await _collection.UpdateOneAsync(filter, update);
                }
            }

            if (newRegisters.Count == 0)
                return Results.BadRequest(new { message = "No new registrations to insert." });

            await _collection.InsertManyAsync(newRegisters);
            return Results.Ok(new { message = "Registers created.", data = newRegisters });
        }

        public async Task<IResult> UnregisterTedTeamAsync(RegisterTedTeamDTO dto, string email)
        {
            var user = await _users.Find(u => u.Email == email).FirstOrDefaultAsync();
            if (user == null) return Results.NotFound(new { message = "User not found." });

            var deleteFilter = Builders<Register>.Filter.And(
                Builders<Register>.Filter.Eq(r => r.AssignId, user.Id),
                Builders<Register>.Filter.In(r => r.ScheduleId, dto.scheduleId)
            );

            var result = await _collection.DeleteManyAsync(deleteFilter);

            if (result.DeletedCount == 0)
                return Results.NotFound(new { message = "No matching registers found to delete." });

            return Results.Ok(new { message = "Unregistered from schedules successfully." });
        }


        public async Task<IResult> GetAllRegisteredTeamsAsync()
        {
            var today = DateTime.UtcNow.Date;

            // Tìm ngày đầu tuần (thứ 2 tuần này)
            var startOfWeek = today.AddDays(-(int)today.DayOfWeek + (int)DayOfWeek.Monday);
            // Tìm ngày cuối tuần tới (chủ nhật tuần sau)
            var endOfNextWeek = startOfWeek.AddDays(13);

            var pipeline = new List<BsonDocument>
            {
                new BsonDocument("$lookup", new BsonDocument
                {
                    { "from", "schedule" },
                    { "localField", "schedule_id" },
                    { "foreignField", "_id" },
                    { "as", "schedule" }
                }),
                new BsonDocument("$set", new BsonDocument("schedule", new BsonDocument("$arrayElemAt", new BsonArray { "$schedule", 0 }))),
                 new BsonDocument("$match", new BsonDocument("schedule.date",
                    new BsonDocument
                    {
                        { "$gte", startOfWeek },
                        { "$lte", endOfNextWeek }
                    })),
                new BsonDocument("$lookup", new BsonDocument
                {
                    { "from", "rooms" },
                    { "localField", "schedule.room_id" },
                    { "foreignField", "_id" },
                    { "as", "schedule.room" }
                }),
                new BsonDocument("$set", new BsonDocument("schedule.room", new BsonDocument("$arrayElemAt", new BsonArray { "$schedule.room", 0 }))),

                new BsonDocument("$lookup", new BsonDocument
                {
                    { "from", "slots" },
                    { "localField", "schedule.slot_id" },
                    { "foreignField", "_id" },
                    { "as", "schedule.slot" }
                }),
                new BsonDocument("$set", new BsonDocument("schedule.slot", new BsonDocument("$arrayElemAt", new BsonArray { "$schedule.slot", 0 }))),

                new BsonDocument("$lookup", new BsonDocument
                {
                    { "from", "class" },
                    { "localField", "schedule.class_id" },
                    { "foreignField", "_id" },
                    { "as", "schedule.class" }
                }),
                new BsonDocument("$set", new BsonDocument("schedule.class", new BsonDocument("$arrayElemAt", new BsonArray { "$schedule.class", 0 }))),

                new BsonDocument("$lookup", new BsonDocument
                {
                    { "from", "users" },
                    { "localField", "schedule.tedteam_id" },
                    { "foreignField", "_id" },
                    { "as", "schedule.tedteam" }
                }),
                new BsonDocument("$set", new BsonDocument("schedule.tedteam", new BsonDocument("$arrayElemAt", new BsonArray { "$schedule.tedteam", 0 }))),

                new BsonDocument("$lookup", new BsonDocument
                {
                    { "from", "users" },
                    { "localField", "schedule.coach_id" },
                    { "foreignField", "_id" },
                    { "as", "schedule.coach" }
                }),
                new BsonDocument("$set", new BsonDocument("schedule.coach", new BsonDocument("$arrayElemAt", new BsonArray { "$schedule.coach", 0 }))),
                new BsonDocument("$lookup", new BsonDocument
                {
                    { "from", "users" },
                    { "localField", "assign_id" },
                    { "foreignField", "_id" },
                    { "as", "assign_user" }
                }),
                 new BsonDocument("$set", new BsonDocument("assign_user", new BsonDocument("$arrayElemAt", new BsonArray { "$assign_user", 0 })))
            };

            var result = await _collection.Aggregate<RegisterResponse>(pipeline).ToListAsync();

            var listRegister = new List<RegisterResponse>();

            return Results.Ok(new { data = result });
        }

        public async Task<List<RegisterResponse>> getPopulateStartEndTime(DateTime startDate, DateTime endDate, string? tedteamId)
        {

            var pipeline = new List<BsonDocument>();

            // Nếu có tedteamId thì mới filter
            if (!string.IsNullOrEmpty(tedteamId))
            {
                pipeline.Add(new BsonDocument("$match", new BsonDocument("assign_id", ObjectId.Parse(tedteamId))));
            }

            pipeline.AddRange(new[]
            {
        new BsonDocument("$lookup", new BsonDocument
        {
            { "from", "schedule" },
            { "localField", "schedule_id" },
            { "foreignField", "_id" },
            { "as", "schedule" }
        }),
        new BsonDocument("$set", new BsonDocument("schedule", new BsonDocument("$arrayElemAt", new BsonArray { "$schedule", 0 }))),
        new BsonDocument("$match", new BsonDocument("schedule.date",
            new BsonDocument
            {
                { "$gte", startDate },
                { "$lte", endDate }
            })),
        new BsonDocument("$lookup", new BsonDocument
        {
            { "from", "rooms" },
            { "localField", "schedule.room_id" },
            { "foreignField", "_id" },
            { "as", "schedule.room" }
        }),
        new BsonDocument("$set", new BsonDocument("schedule.room", new BsonDocument("$arrayElemAt", new BsonArray { "$schedule.room", 0 }))),

        new BsonDocument("$lookup", new BsonDocument
        {
            { "from", "slots" },
            { "localField", "schedule.slot_id" },
            { "foreignField", "_id" },
            { "as", "schedule.slot" }
        }),
        new BsonDocument("$set", new BsonDocument("schedule.slot", new BsonDocument("$arrayElemAt", new BsonArray { "$schedule.slot", 0 }))),

        new BsonDocument("$lookup", new BsonDocument
        {
            { "from", "class" },
            { "localField", "schedule.class_id" },
            { "foreignField", "_id" },
            { "as", "schedule.class" }
        }),
        new BsonDocument("$set", new BsonDocument("schedule.class", new BsonDocument("$arrayElemAt", new BsonArray { "$schedule.class", 0 }))),

        new BsonDocument("$lookup", new BsonDocument
        {
            { "from", "users" },
            { "localField", "schedule.tedteam_id" },
            { "foreignField", "_id" },
            { "as", "schedule.tedteam" }
        }),
        new BsonDocument("$set", new BsonDocument("schedule.tedteam", new BsonDocument("$arrayElemAt", new BsonArray { "$schedule.tedteam", 0 }))),

        new BsonDocument("$lookup", new BsonDocument
        {
            { "from", "users" },
            { "localField", "schedule.coach_id" },
            { "foreignField", "_id" },
            { "as", "schedule.coach" }
        }),
        new BsonDocument("$set", new BsonDocument("schedule.coach", new BsonDocument("$arrayElemAt", new BsonArray { "$schedule.coach", 0 }))),

        new BsonDocument("$lookup", new BsonDocument
        {
            { "from", "users" },
            { "localField", "assign_id" },
            { "foreignField", "_id" },
            { "as", "assign_user" }
        }),
        new BsonDocument("$set", new BsonDocument("assign_user", new BsonDocument("$arrayElemAt", new BsonArray { "$assign_user", 0 })))
    });

            var result = await _collection.Aggregate<RegisterResponse>(pipeline).ToListAsync();

            var listRegister = new List<RegisterResponse>();
            return result;
        }

        public async Task<IResult> AcceptRegister(string registerId)
        {
            var acceptedRegister = await _collection.Find(r => r.Id == registerId).FirstOrDefaultAsync();
            if (acceptedRegister == null)
                return Results.NotFound(new { message = "Register not found." });

            var acceptedSchedule = await _schedules_repository.GetByIdAsync(acceptedRegister.ScheduleId);

            if (acceptedSchedule == null)
                return Results.NotFound(new { message = "Schedule not found for the accepted register." });
            if (acceptedSchedule.TedTeamId != null)
                return Results.BadRequest(new { message = "Schedule already assigned to a Ted Team." });

            // 1. Approve selected register
            var filter = Builders<Register>.Filter.Eq(r => r.Id, registerId);
            var update = Builders<Register>.Update.Set(r => r.Status, RegisterStatus.Approved);
            await _collection.UpdateOneAsync(filter, update);

            // 2. Reject all other registers to the same schedule
            var rejectOthers = Builders<Register>.Filter.And(
                Builders<Register>.Filter.Ne(r => r.Id, registerId),
                Builders<Register>.Filter.Eq(r => r.ScheduleId, acceptedRegister.ScheduleId)
            );
            var rejectUpdate = Builders<Register>.Update.Set(r => r.Status, RegisterStatus.Rejected);
            await _collection.UpdateManyAsync(rejectOthers, rejectUpdate);

            // 3. Reject same user's registers that conflict on same slot + date
           

            if (acceptedSchedule != null)
            {
                if (string.IsNullOrEmpty(acceptedSchedule.TedTeamId))
                {
                    await _schedules_repository.UpdateAsync(
                        acceptedSchedule.Id,
                        s =>
                        {
                            s.TedTeamId = acceptedRegister.AssignId;
                        }
                    );
                }

                var attendanceTedteam = new Attendance
                {
                    UserId = acceptedRegister.AssignId,
                    ScheduleId = acceptedSchedule.Id,
                    Status = AttendanceStatus.NotYet,
                };

                await _attendance.InsertOneAsync(attendanceTedteam);

                var userRegisters = await _collection.Find(r =>
                    r.AssignId == acceptedRegister.AssignId &&
                    r.Id != registerId).ToListAsync();

                var conflictFilter = Builders<Register>.Filter.And(
                    Builders<Register>.Filter.Eq(r => r.AssignId, acceptedRegister.AssignId),
                    Builders<Register>.Filter.Ne(r => r.Id, registerId),
                    Builders<Register>.Filter.In(r => r.ScheduleId, userRegisters
                        .Where(r => _schedules.AsQueryable()
                            .Any(s => s.Id == r.ScheduleId &&
                                      s.SlotId == acceptedSchedule.SlotId &&
                                      s.Date == acceptedSchedule.Date))
                        .Select(r => r.ScheduleId))
                );

                var conflictUpdate = Builders<Register>.Update.Set(r => r.Status, RegisterStatus.Rejected);
                await _collection.UpdateManyAsync(conflictFilter, conflictUpdate);
            }

            return Results.Ok(new { message = "Register approved and conflicts rejected." });
        }

        public async Task<IResult> RejectRegister(string registerId)
        {
            var filter = Builders<Register>.Filter.Eq(r => r.Id, registerId);
            var update = Builders<Register>.Update.Set(r => r.Status, RegisterStatus.Rejected);
            var result = await _collection.UpdateOneAsync(filter, update);
            return result.ModifiedCount > 0 ? Results.Ok(new { message = "Register rejected." }) : Results.NotFound();
        }
    }
}
