using kul_local_back_end.Entities;
using kul_local_back_end.Repository;
using kul_locall_back_end.Entities;
using kul_locall_back_end.models.classes;
using MongoDB.Bson;
using MongoDB.Driver;

namespace kul_local_back_end.Repositories
{
    public class ClassRepository : BaseRepository<Class>, IClass
    {
        private readonly UsersRepository _userCollection;
        private readonly IMongoCollection<Schedule> _schedule;

        public ClassRepository(IMongoDatabase database, string collectionName, UsersRepository usersRepository) : base(database, collectionName)
        {
            _userCollection = usersRepository;
            _schedule = database.GetCollection<Schedule>("schedule");
        }

        public async Task<IResult> GetClassByIdAsync(string id)
        {
            var classEntity = await GetByIdAsync(id);
            return classEntity != null
                ? Results.Ok(new { data = classEntity, message = "Class found." })
                : Results.NotFound(new { message = "Class not found." });
        }

        public async Task<Class> GetClassById(string class_id)
        {
            return await GetByIdAsync(class_id);
        }

        public async Task<List<User>> getMemberByClass(string class_id)
        {
            var filter = Builders<User>.Filter.Eq(u => u.ClassId, class_id);
            return await _userCollection.GetByFilterAsync(filter);
        }

        public async Task<IResult> GetAllClassesAsync(int? pageNumber = 1, int? pageSize = 10, string? search = null)
        {

            var classes = await GetAllAsync();

            return Results.Ok(new { data = classes, message = "Classes retrieved." });
        }

        public async Task<IResult> CreateClassAsync(CreateClassDTO classEntity)
        {

            if (string.IsNullOrWhiteSpace(classEntity.name) || classEntity.start_time == null || classEntity.end_time == null)
            {
                return Results.BadRequest(new { message = "Invalid class data." });
            }

            if (classEntity.start_time >= classEntity.end_time)
            {
                return Results.BadRequest(new { message = "Start time must be before end time." });
            }

            var newClass = new Class
            {
                Name = classEntity.name,
                StartTime = classEntity.start_time,
                EndTime = classEntity.end_time,
            };

            await CreateAsync(newClass);
            return Results.Ok(new { data = newClass, message = "Class created successfully." });
        }

        public async Task<IResult> UpdateClassAsync(string id, UpdateClassDTO classEntity)
        {
            var existing = await GetByIdAsync(id);
            if (existing == null)
                return Results.NotFound(new { message = "Class not found." });

            if(classEntity.start_time > classEntity.end_time)
            {
                return Results.BadRequest(new { message = "Start time must be before end time." });
            }

            await UpdateAsync(id, c =>
            {
                c.Name = classEntity.name ?? c.Name;
                c.StartTime = classEntity.start_time ?? c.StartTime;
                c.EndTime = classEntity.end_time ?? c.EndTime;
            });

            return Results.Ok(new { message = "Class updated successfully." });
        }

        public async Task<IResult> DeleteClassAsync(string id)
        {
            var deleted = await DeleteAsync(id);
            return deleted != null
                ? Results.Ok(new { data = deleted, message = "Class deleted." })
                : Results.NotFound(new { message = "Class not found." });
        }

        public async Task<List<User>> getAllUserInClass(string class_id)
        {
            var filter = Builders<User>.Filter.Eq(u => u.ClassId, class_id);
            return await _userCollection.GetByFilterAsync(filter);
        }

        public async Task<IResult> AddMemberToClassAsync(string class_id, string email)
        {
            var existingClass = await GetByIdAsync(class_id);

            if (existingClass == null)
                return Results.NotFound(new { message = "Class not found." });

            var user = await _userCollection.GetUserByEmail(email);
            if (user == null)
                return Results.NotFound(new { message = "User not found." });

            var filter = Builders<User>.Filter.Eq(u => u.Email, email);
            var update = Builders<User>.Update.Set(u => u.ClassId, class_id);


            var result = await _userCollection.UpdateAsync(user.Id, u =>
            {
                u.ClassId = class_id;
            });

            if (result != null)
                return Results.Ok(new { message = "User added to class." });

            return Results.NotFound(new { message = "User not found or already in class." });
        }

        public async Task<IResult> RemoveMemberFromClassAsync(string class_id, string email)
        {
            var user = await _userCollection.GetUserByEmail(email);
            if (user == null || user.ClassId != class_id)
                return Results.NotFound(new { message = "User not found in the specified class." });

            var update = Builders<User>.Update.Set(u => u.ClassId, null);
            await _userCollection.UpdateAsync(user.Id, u =>
            {
                u.ClassId = null;
            });

            return Results.Ok(new { message = "User removed from class." });
        }

        public async Task<IResult> GetClassesForTedTeamAsync(string email)
        {
            var user = await _userCollection.GetUserByEmail(email);
            if (user == null)
                return Results.NotFound(new { message = "User not found." });

            var today = DateTime.UtcNow.Date;

            var scheduleFilter = Builders<Schedule>.Filter.And(
                Builders<Schedule>.Filter.Eq(s => s.TedTeamId, user.Id)
                //Builders<Schedule>.Filter.Gte(s => s.Date, today),
                //Builders<Schedule>.Filter.Lt(s => s.Date, today.AddDays(1))
            );

            var schedules = await _schedule.Find(scheduleFilter).ToListAsync();
            var classIds = schedules.Select(s => s.ClassId).Distinct().ToList();

            var classFilter = Builders<Class>.Filter.In(c => c.Id, classIds);
            var classes = await _collection.Find(classFilter).ToListAsync();

            // Add member list to each class
            var response = new List<object>();
            foreach (var c in classes)
            {
                var members = await _userCollection.GetMemberClass(c.Id);
                response.Add(new
                {
                    @class = c,
                    members
                });
            }

            return Results.Ok(new { data = response });
        }
    }
}
