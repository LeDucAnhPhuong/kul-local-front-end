using kul_local_back_end.Entities;
using kul_local_back_end.Repository;
using kul_locall_back_end.Entities;
using kul_locall_back_end.models.schedule;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;

namespace kul_local_back_end.Repositories
{
    public class ScheduleRepository : BaseRepository<Schedule>, ISchedule
    {
        private readonly IMongoDatabase _db;
        private readonly IMongoCollection<Class> _classes;
        private readonly UsersRepository _user_repository;
        private readonly ClassRepository _classRepository;
        private readonly IMongoCollection<Attendance> _attendances;

        public ScheduleRepository(
            IMongoDatabase db,
            string collectionName,
            UsersRepository usersRepository,
            ClassRepository classRepository
        )
            : base(db, collectionName)
        {
            _db = db;
            _classes = db.GetCollection<Class>("class");
            _user_repository = usersRepository;
            _attendances = db.GetCollection<Attendance>("attendance");
            _classRepository = classRepository;
        }

        public async Task<bool> IsScheduleConflictAsync(
            string scheduleId,
            string slotId,
            DateTime date
        )
        {
            var filter = Builders<Schedule>.Filter.And(
                Builders<Schedule>.Filter.Eq(s => s.SlotId, slotId),
                Builders<Schedule>.Filter.Eq(s => s.Date, date),
                Builders<Schedule>.Filter.Eq(s => s.Id, scheduleId)
            );

            return await _collection.Find(filter).AnyAsync();
        }

        public async Task<IResult> GetAllSchedule()
        {
            var filter = Builders<Schedule>.Filter.Eq(s => s.IsActive, true);
            var data = await GetPopulatedSchedulesAsync(filter);
            return Results.Ok(new { data });
        }

        public async Task<IResult> GetScheduleDateRange(DateTime startDate, DateTime endDate)
        {
            var filter =
                Builders<Schedule>.Filter.Gte(s => s.Date, startDate)
                & Builders<Schedule>.Filter.Lte(s => s.Date, endDate)
                & Builders<Schedule>.Filter.Eq(s => s.IsActive, true);
            var data = await GetPopulatedSchedulesAsync(filter);
            return Results.Ok(new { data });
        }

        public async Task<IResult> CreateSchedule(CreateScheduleDTO dto)
        {
            var startOfDay = dto.Date.Date;
            var endOfDay = startOfDay.AddDays(1);

            var conflictFilter = Builders<Schedule>.Filter.And(
                Builders<Schedule>.Filter.Eq(s => s.RoomId, dto.RoomId),
                Builders<Schedule>.Filter.Eq(s => s.SlotId, dto.SlotIds),
                Builders<Schedule>.Filter.Gte(s => s.Date, startOfDay),
                Builders<Schedule>.Filter.Lt(s => s.Date, endOfDay),
                Builders<Schedule>.Filter.Eq(s => s.IsActive, true)

            );

            var conflict = await _collection.Find(conflictFilter).FirstOrDefaultAsync();
            if (conflict != null)
            {
                return Results.BadRequest(
                    new { message = "This room and slot are already scheduled on this date." }
                );
            }

            var coach = await _user_repository.GetUserByEmail(dto.CoachEmail);

            var teacherConflictFilter = Builders<Schedule>.Filter.And(
                Builders<Schedule>.Filter.Eq(s => s.CoachId, coach.Id),
                Builders<Schedule>.Filter.Eq(s => s.Date, dto.Date),
                Builders<Schedule>.Filter.Eq(s => s.SlotId, dto.SlotIds),
                Builders<Schedule>.Filter.Eq(s => s.IsActive, true)

            );
            var teacherConflict = await _collection
                .Find(teacherConflictFilter)
                .FirstOrDefaultAsync();
            if (teacherConflict != null)
            {
                return Results.BadRequest(
                    new
                    {
                        message = "Teacher already has a schedule on this date in a different slot.",
                    }
                );
            }
            var classConflict = Builders<Schedule>.Filter.And(
                          Builders<Schedule>.Filter.Eq(s => s.ClassId, dto.classId ),
                          Builders<Schedule>.Filter.Eq(s => s.Date, dto.Date),
                          Builders<Schedule>.Filter.Eq(s => s.SlotId, dto.SlotIds ),
                          Builders<Schedule>.Filter.Eq(s => s.IsActive, true)

                      );

            var classInfo = await _collection.Find(classConflict).FirstOrDefaultAsync();
            if (classInfo != null)
            {
                return Results.BadRequest(new { message = "Class already has a schedule on this date in a same slot." });
            }

            var schedule = new Schedule
            {
                RoomId = dto.RoomId,
                SlotId = dto.SlotIds,
                ClassId = dto.classId,
                CoachId = coach.Id,
                Date = dto.Date,
            };

            await CreateAsync(schedule);

            var students = await _classRepository.getAllUserInClass(dto.classId);
            var attendanceList = students
                .Select(student => new Attendance
                {
                    UserId = student.Id,
                    ScheduleId = schedule.Id,
                    Status = AttendanceStatus.NotYet,
                })
                .ToList();

            if (attendanceList.Count > 0)
            {
                await _attendances.InsertManyAsync(attendanceList);
            }

            return Results.Ok(
                new { data = schedule, message = "Schedule and attendance created." }
            );
        }

        public async Task<IResult> UpdateSchedule(string id, UpdateScheduleDTO dto)
        {
            var existing = await GetByIdAsync(id);
            if (existing == null)
                return Results.NotFound(new { message = "Schedule not found." });

            var startOfDay = dto.Date?.Date ?? existing.Date.Date;
            var endOfDay = startOfDay.AddDays(1);

            var conflictFilter = Builders<Schedule>.Filter.And(
                Builders<Schedule>.Filter.Eq(s => s.RoomId, dto?.RoomId ?? existing?.RoomId),
                Builders<Schedule>.Filter.Eq(s => s.SlotId, dto?.SlotId ?? existing?.SlotId),
                Builders<Schedule>.Filter.Gte(s => s.Date, startOfDay),
                Builders<Schedule>.Filter.Lt(s => s.Date, endOfDay),
                Builders<Schedule>.Filter.Eq(s => s.IsActive, true)

            );

            var conflict = await _collection.Find(conflictFilter).FirstOrDefaultAsync();
            if (conflict != null)
            {
                return Results.BadRequest(
                    new { message = "This room and slot are already scheduled on this date." }
                );
            }

            var coach = await _user_repository.GetByIdAsync(dto?.CoachId ?? existing?.CoachId);

            var teacherConflictFilter = Builders<Schedule>.Filter.And(
                Builders<Schedule>.Filter.Eq(s => s.CoachId, coach.Id),
                Builders<Schedule>.Filter.Eq(s => s.Date, dto.Date),
                Builders<Schedule>.Filter.Eq(s => s.SlotId, dto?.SlotId ?? existing?.SlotId),
                Builders<Schedule>.Filter.Eq(s => s.IsActive, true)

            );
            var teacherConflict = await _collection
                .Find(teacherConflictFilter)
                .FirstOrDefaultAsync();
            if (teacherConflict != null)
            {
                return Results.BadRequest(
                    new
                    {
                        message = "Teacher already has a schedule on this date in a same slot.",
                    }
                );
            }

            var classConflict = Builders<Schedule>.Filter.And(
                Builders<Schedule>.Filter.Eq(s => s.ClassId, dto?.classId ?? existing?.ClassId),
                Builders<Schedule>.Filter.Eq(s => s.Date, dto.Date),
                Builders<Schedule>.Filter.Eq(s => s.SlotId, dto?.SlotId ?? existing?.SlotId),
                Builders<Schedule>.Filter.Eq(s => s.IsActive, true)

            );

            var classInfo = await _collection.Find(classConflict).FirstOrDefaultAsync();
            if (classInfo != null)
            {
                return Results.BadRequest(new { message = "Class already has a schedule on this date in a same slot." });
            }
           

            await UpdateAsync(
                id,
                s =>
                {
                    s.RoomId = dto.RoomId ?? s.RoomId;
                    s.SlotId = dto.SlotId ?? s.SlotId;
                    s.ClassId = dto.classId ?? s.ClassId;
                    s.TedTeamId = dto.tedteamId ?? s.TedTeamId;
                    s.CoachId = dto.CoachId ?? s.CoachId;
                    s.Date = dto.Date ?? s.Date;
                }
            );

            return Results.Ok(new { message = "Schedule updated." });
        }

        public async Task<IResult> DeletecSheduleAsync(string id)
        {
            var existing = await GetByIdAsync(id);
            if (existing == null)
                return Results.NotFound(new { message = "Schedule not found." });
            var filter = Builders<Schedule>.Filter.Eq(s => s.Id, id);
            var result = await DeleteAsync(id);
            if (result == null)
                return Results.BadRequest(new { message = "Failed to delete schedule." });
            return Results.Ok(new { message = "Schedule deleted successfully." });
        }

        public async Task<List<ScheduleResponse>> GetPopulatedSchedulesAsync(
            FilterDefinition<Schedule> filter
        )
        {
            var serializerRegistry = BsonSerializer.SerializerRegistry;
            var serializer = serializerRegistry.GetSerializer<Schedule>();

            var renderArgs = new RenderArgs<Schedule>(serializer, serializerRegistry);
            var renderedFilter = filter.Render(renderArgs);

            var pipeline = new List<BsonDocument>
            {
                new BsonDocument("$match", renderedFilter),
                new BsonDocument(
                    "$lookup",
                    new BsonDocument
                    {
                        { "from", "rooms" },
                        { "localField", "room_id" },
                        { "foreignField", "_id" },
                        { "as", "room" },
                    }
                ),
                new BsonDocument(
                    "$set",
                    new BsonDocument(
                        "room",
                        new BsonDocument("$arrayElemAt", new BsonArray { "$room", 0 })
                    )
                ),
                new BsonDocument(
                    "$lookup",
                    new BsonDocument
                    {
                        { "from", "slots" },
                        { "localField", "slot_id" },
                        { "foreignField", "_id" },
                        { "as", "slot" },
                    }
                ),
                new BsonDocument(
                    "$set",
                    new BsonDocument(
                        "slot",
                        new BsonDocument("$arrayElemAt", new BsonArray { "$slot", 0 })
                    )
                ),
                new BsonDocument(
                    "$lookup",
                    new BsonDocument
                    {
                        { "from", "class" },
                        { "localField", "class_id" },
                        { "foreignField", "_id" },
                        { "as", "class" },
                    }
                ),
                new BsonDocument(
                    "$set",
                    new BsonDocument(
                        "class",
                        new BsonDocument("$arrayElemAt", new BsonArray { "$class", 0 })
                    )
                ),
                new BsonDocument(
                    "$lookup",
                    new BsonDocument
                    {
                        { "from", "users" },
                        { "localField", "tedteam_id" },
                        { "foreignField", "_id" },
                        { "as", "tedteam" },
                    }
                ),
                new BsonDocument(
                    "$set",
                    new BsonDocument(
                        "tedteam",
                        new BsonDocument("$arrayElemAt", new BsonArray { "$tedteam", 0 })
                    )
                ),
                new BsonDocument(
                    "$lookup",
                    new BsonDocument
                    {
                        { "from", "users" },
                        { "localField", "coach_id" },
                        { "foreignField", "_id" },
                        { "as", "coach" },
                    }
                ),
                new BsonDocument(
                    "$set",
                    new BsonDocument(
                        "coach",
                        new BsonDocument("$arrayElemAt", new BsonArray { "$coach", 0 })
                    )
                ),
            };
            return await _collection.Aggregate<ScheduleResponse>(pipeline).ToListAsync();
        }

        public async Task<IResult> GetPersonalDateRange(
            string email,
            DateTime startDate,
            DateTime endDate
        )
        {
            var user = await _user_repository.GetUserByEmail(email);

            if (user == null)
            {
                return Results.NotFound(new { message = "User not found." });
            }

            switch (user.Role.ToString())
            {
                case "Coach":
                    return await GetCoachSchedule(user.Id, startDate, endDate);
                case "Tedteam":
                    return Results.BadRequest(new { message = "Invalid user role." });
                default:
                    return Results.BadRequest(new { message = "Invalid user role." });
            }
        }

        private async Task<IResult> GetCoachSchedule(
            string coachId,
            DateTime startDate,
            DateTime endDate
        )
        {
            var filter = Builders<Schedule>.Filter.And(
                Builders<Schedule>.Filter.Eq(s => s.CoachId, coachId),
                Builders<Schedule>.Filter.Gte(s => s.Date, startDate),
                Builders<Schedule>.Filter.Lte(s => s.Date, endDate)
            );
            var data = await GetPopulatedSchedulesAsync(filter);
            return Results.Ok(new { data });
        }
    }
}
