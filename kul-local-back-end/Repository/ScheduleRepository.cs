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


        public ScheduleRepository(IMongoDatabase db, string collectionName, UsersRepository usersRepository, ClassRepository classRepository ) : base(db, collectionName)
        {
            _db = db;
            _classes = db.GetCollection<Class>("classes");
            _user_repository = usersRepository;
            _attendances = db.GetCollection<Attendance>("attendances");
            _classRepository = classRepository;
        }

       

        public async Task<bool> IsScheduleConflictAsync(string scheduleId, string slotId, DateTime date)
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
            var filter = Builders<Schedule>.Filter.Empty;
            var data = await GetPopulatedSchedulesAsync(filter);
            return Results.Ok(new { data });
        }

        public async Task<IResult> GetScheduleDateRange(DateTime startDate, DateTime endDate)
        {
            var filter = Builders<Schedule>.Filter.Gte(s => s.Date, startDate) &
                         Builders<Schedule>.Filter.Lte(s => s.Date, endDate);
            var data = await GetPopulatedSchedulesAsync(filter);
            return Results.Ok(new { data });
        }

        public async Task<IResult> CreateSchedule(CreateScheduleDTO dto)
        {
            var conflictFilter = Builders<Schedule>.Filter.And(
                Builders<Schedule>.Filter.Eq(s => s.RoomId, dto.RoomId),
                Builders<Schedule>.Filter.Eq(s => s.SlotId, dto.SlotId),
                Builders<Schedule>.Filter.Eq(s => s.Date, dto.Date)
            );

            var conflict = await _collection.Find(conflictFilter).FirstOrDefaultAsync();
            if (conflict != null)
            {
                return Results.BadRequest(new { message = "This room and slot are already scheduled on this date." });
            }

            var coach = await _user_repository.GetUserByEmail(dto.CoachEmail);

            // Kiểm tra giáo viên đã có lịch khác cùng ngày khác slot chưa
            var teacherConflictFilter = Builders<Schedule>.Filter.And(
                Builders<Schedule>.Filter.Eq(s => s.CoachId, coach.Id),
                Builders<Schedule>.Filter.Eq(s => s.Date, dto.Date),
                Builders<Schedule>.Filter.Ne(s => s.SlotId, dto.SlotId)
            );
            var teacherConflict = await _collection.Find(teacherConflictFilter).FirstOrDefaultAsync();
            if (teacherConflict != null)
            {
                return Results.BadRequest(new { message = "Teacher already has a schedule on this date in a different slot." });
            }

            var classInfo = await _classes.Find(c => c.Id == dto.classId).FirstOrDefaultAsync();
            if (classInfo == null)
            {
                return Results.BadRequest(new { message = "Class not found." });
            }
            if (dto.Date < classInfo.StartTime || dto.Date > classInfo.EndTime)
            {
                return Results.BadRequest(new { message = "Date is outside the class active period." });
            }

            var schedule = new Schedule
            {
                RoomId = dto.RoomId,
                SlotId = dto.SlotId,
                ClassId = dto.classId,
                CoachId = coach.Id,
                Date = dto.Date
            };

            await CreateAsync(schedule);

            // Tạo danh sách điểm danh cho học sinh trong lớp và giáo viên
            var students = await _classRepository.getAllUserInClass(dto.classId);
            var attendanceList = students.Select(student => new Attendance
            {
                UserId = student.Id,
                ScheduleId = schedule.Id,
                Status = AttendanceStatus.NotYet
            }).ToList();

            attendanceList.Add(new Attendance
            {
                UserId = coach.Id,
                ScheduleId = schedule.Id,
                Status = AttendanceStatus.NotYet
            });

            await _attendances.InsertManyAsync(attendanceList);

            return Results.Ok(new { data = schedule, message = "Schedule and attendance created." });
        }
        public async Task<IResult> UpdateSchedule(UpdateScheduleDTO dto)
        {
            var existing = await GetByIdAsync(dto.Id);
            if (existing == null) return Results.NotFound(new { message = "Schedule not found." });

            await UpdateAsync(dto.Id, s =>
            {
                s.RoomId = dto.RoomId ?? s.RoomId;
                s.SlotId = dto.SlotId ?? s.SlotId;
                s.ClassId = dto.classId ?? s.ClassId;
                s.TedTeamId = dto.tedteamId ?? s.TedTeamId;
                s.CoachId = dto.CoachId ?? s.CoachId;
                s.Date = dto.Date ?? s.Date;
            });

            return Results.Ok(new { message = "Schedule updated." });
        }

        public async Task<List<ScheduleResponse>> GetPopulatedSchedulesAsync(FilterDefinition<Schedule> filter)
        {
            var serializerRegistry = BsonSerializer.SerializerRegistry;
            var serializer = serializerRegistry.GetSerializer<Schedule>();

            var renderArgs = new RenderArgs<Schedule>(serializer, serializerRegistry);
            var renderedFilter = filter.Render(renderArgs);

            var pipeline = new List<BsonDocument>
            {
                new BsonDocument("$match", renderedFilter),

                new BsonDocument("$lookup", new BsonDocument
                {
                    { "from", "rooms" },
                    { "localField", "room_id" },
                    { "foreignField", "_id" },
                    { "as", "room" }
                }),
                new BsonDocument("$set", new BsonDocument("room", new BsonDocument("$arrayElemAt", new BsonArray { "$room", 0 }))),

                new BsonDocument("$lookup", new BsonDocument
                {
                    { "from", "slots" },
                    { "localField", "slot_id" },
                    { "foreignField", "_id" },
                    { "as", "slot" }
                }),
                new BsonDocument("$set", new BsonDocument("slot", new BsonDocument("$arrayElemAt", new BsonArray { "$slot", 0 }))),

                new BsonDocument("$lookup", new BsonDocument
                {
                    { "from", "class" },
                    { "localField", "class_id" },
                    { "foreignField", "_id" },
                    { "as", "class" }
                }),
                new BsonDocument("$set", new BsonDocument("class", new BsonDocument("$arrayElemAt", new BsonArray { "$class", 0 }))),

                new BsonDocument("$lookup", new BsonDocument
                {
                    { "from", "users" },
                    { "localField", "tedteam_id" },
                    { "foreignField", "_id" },
                    { "as", "tedteam" }
                }),
                new BsonDocument("$set", new BsonDocument("tedteam", new BsonDocument("$arrayElemAt", new BsonArray { "$tedteam", 0 }))),

                new BsonDocument("$lookup", new BsonDocument
                {
                    { "from", "users" },
                    { "localField", "coach_id" },
                    { "foreignField", "_id" },
                    { "as", "coach" }
                }),
                new BsonDocument("$set", new BsonDocument("coach", new BsonDocument("$arrayElemAt", new BsonArray { "$coach", 0 })))
            };
            return await _collection.Aggregate<ScheduleResponse>(pipeline).ToListAsync();
        }

        public async Task<IResult> GetPersonalDateRange(string email, DateTime startDate, DateTime endDate)
        {
            var user = await _user_repository.GetUserByEmail(email);

            if (user == null)
            {
                return Results.NotFound(new { message = "User not found." });
            }

            switch(user.Role.ToString())
            {
                case "Coach":
                    return await GetCoachSchedule(user.Id, startDate, endDate);
                case "Tedteam":
                    return Results.BadRequest(new { message = "Invalid user role." });
                default:
                    return Results.BadRequest(new { message = "Invalid user role." });
            }
        }

        private async Task<IResult> GetCoachSchedule(string coachId, DateTime startDate, DateTime endDate)
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
