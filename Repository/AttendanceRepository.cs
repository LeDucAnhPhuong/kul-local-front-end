using kul_local_back_end.Entities;
using kul_local_back_end.Repository;
using kul_locall_back_end;
using kul_locall_back_end.models.attendance;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;

namespace kul_local_back_end.Repositories
{
    public class AttendanceRepository : BaseRepository<Attendance>, IAttendance
    {
        private readonly IMongoCollection<User> _users;
        private readonly ScheduleRepository _schedulesRepo;
        private readonly ClassRepository _classRepo;
        private readonly UsersRepository _userRepo;

        public AttendanceRepository(IMongoDatabase db, string collectionName, ScheduleRepository scheduleRepository, ClassRepository classRepository, UsersRepository usersRepository) : base(db, collectionName)
        {
            _users = db.GetCollection<User>("users");
            _schedulesRepo = scheduleRepository;
            _classRepo = classRepository;
            _userRepo = usersRepository;
        }

        public async Task<IResult> GetPersonalAttendance(string email, DateTime startDate, DateTime endDate)
        {
            var user = await _users.Find(u => u.Email == email).FirstOrDefaultAsync();
            if (user == null)
                return Results.NotFound(new { message = "User not found." });

            var filter = Builders<Attendance>.Filter.And(
                Builders<Attendance>.Filter.Eq(a => a.UserId, user.Id)
            );

            var attendances = await GetPopulatedAttendancesAsync(filter);

            var data = attendances
    .Where(a => a.Schedule?.Date >= startDate && a.Schedule?.Date <= endDate)
    .ToList();
            return Results.Ok(new { data = data });
        }

        public async Task<IResult> UpdateAttendance(AttendanceStatus status, string user_id)
        {
            var filter = Builders<Attendance>.Filter.Eq(a => a.UserId, user_id);
            var update = Builders<Attendance>.Update.Set(a => a.Status, status);
            var result = await _collection.UpdateOneAsync(filter, update);
            return result.ModifiedCount > 0 ? Results.Ok(new { message = "Attendance updated." }) : Results.NotFound();
        }

        public async Task<IResult> GetAllAttendance()
        {
            var filter = Builders<Attendance>.Filter.Eq(a => a.Status, AttendanceStatus.NotYet);
            var notYetAttendances = await _collection.Find(filter).ToListAsync();
            return Results.Ok(new { data = notYetAttendances });
        }

        public async Task<IResult> CheckAttendanceAsync(CheckAttendanceRequest request, string email)
        {

            var tedteam = await _userRepo.GetUserByEmail(email);
            if(tedteam == null || tedteam.Role != UserRole.Tedteam.ToString())
                return Results.BadRequest(new { message = "You are not authorized to check attendance." });

            var schedule = await _schedulesRepo.GetByIdAsync(request.ScheduleId);

            if (schedule == null)
                return Results.BadRequest(new { message = "Schedule not found." });

            //if (tedteam.ClassId != schedule.TedTeamId)
            //    return Results.BadRequest(new { message = "You are not authorized to check attendance for this class." });

            var classEntity = await _classRepo.GetByIdAsync(request.ClassId);
            if (classEntity == null)
                return Results.BadRequest(new { message = "Class not found." });

            var usersInClass = await _userRepo.GetByFilterAsync(
                Builders<User>.Filter.And(
                    Builders<User>.Filter.Eq(u => u.ClassId, request.ClassId),
                    Builders<User>.Filter.Eq(u => u.Role, UserRole.Student.ToString())
            ));
            var validUserIds = usersInClass.Select(u => u.Id).ToHashSet();

            foreach (var student in request.Students)
            {
                if (!validUserIds.Contains(student.UserId)) continue;

                var filter = Builders<Attendance>.Filter.And(
                    Builders<Attendance>.Filter.Eq(a => a.UserId, student.UserId),
                    Builders<Attendance>.Filter.Eq(a => a.ScheduleId, request.ScheduleId)
                );

                var update = Builders<Attendance>.Update.Set(a => a.Status, student.Status);
                await UpdateOneAsync(filter, update);
            }

            if (schedule != null)
            {
                var tedFilter = Builders<Attendance>.Filter.And(
                    Builders<Attendance>.Filter.Eq(a => a.UserId, schedule.TedTeamId),
                    Builders<Attendance>.Filter.Eq(a => a.ScheduleId, request.ScheduleId)
                );

                var updateTed = Builders<Attendance>.Update.Set(a => a.Status, AttendanceStatus.Present);
                await UpdateOneAsync(tedFilter, updateTed, tedteam.Id);
            }

            return Results.Ok(new { message = "Attendance updated." });
        }

        public async Task<List<AttendanceResponse>> GetPopulatedAttendancesAsync(FilterDefinition<Attendance> filter)
        {
            var serializerRegistry = BsonSerializer.SerializerRegistry;
            var serializer = serializerRegistry.GetSerializer<Attendance>();
            var renderedFilter = filter.Render(new RenderArgs<Attendance>(serializer, serializerRegistry));

            var pipeline = new List<BsonDocument>
            {
                new BsonDocument("$match", renderedFilter),

                new BsonDocument("$lookup", new BsonDocument
                {
                    { "from", "users" },
                    { "localField", "user_id" },
                    { "foreignField", "_id" },
                    { "as", "user" }
                }),
                new BsonDocument("$set", new BsonDocument("user", new BsonDocument("$arrayElemAt", new BsonArray { "$user", 0 }))),

                new BsonDocument("$lookup", new BsonDocument
                {
                    { "from", "schedule" },
                    { "localField", "schedule_id" },
                    { "foreignField", "_id" },
                    { "as", "schedule" }
                }),
                new BsonDocument("$set", new BsonDocument("schedule", new BsonDocument("$arrayElemAt", new BsonArray { "$schedule", 0 }))),

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
                new BsonDocument("$set", new BsonDocument("schedule.coach", new BsonDocument("$arrayElemAt", new BsonArray { "$schedule.coach", 0 })))
            };

            return await _collection.Aggregate<AttendanceResponse>(pipeline).ToListAsync();
        }
    }
}
