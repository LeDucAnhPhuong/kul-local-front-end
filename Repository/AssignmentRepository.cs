using kul_local_back_end.Entities;
using kul_local_back_end.models.assignment;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;

namespace kul_local_back_end.Repository
{
    public class AssignmentRepository : BaseRepository<Assignment>, IAssignmentRepository
    {
        private readonly UsersRepository _usersRepository;
        private readonly IMongoCollection<AssignmentSubmission> _assignmentSubmission;
        public AssignmentRepository(IMongoDatabase db, UsersRepository usersRepository) : base(db, "assignments") {
            _usersRepository = usersRepository;
            _assignmentSubmission = db.GetCollection<AssignmentSubmission>("assignment_submissions");
        }

        public async Task<IResult> CreateAsync(CreateAssignmentDTO dto, string? email)
        {

            var user = await _usersRepository.GetUserByEmail(email);

            if (user == null)
            {
                return Results.NotFound(new { message = "User not found" });
            }

            var assignment = new Assignment
            {
                Title = dto.Title,
                Type = dto.Type,
                StartTime = dto.StartTime,
                DueTime = dto.DueTime,
                Content = dto.Content,
                ClassId = dto.ClassId,
            };
            return Results.Ok(await base.CreateAsync(assignment, user.Id));
        }

        public async Task<IResult> UpdateAsync(string id, UpdateAssignmentDTO dto, string? email)
        {

            var user = await _usersRepository.GetUserByEmail(email);
            if (user == null)
            {
                return Results.NotFound(new { message = "User not found" });
            }

            return Results.Ok(await base.UpdateAsync(id, entity =>
            {
                entity.Title = dto.Title;
                entity.Type = dto.Type;
                entity.StartTime = dto.StartTime;
                entity.DueTime = dto.DueTime;
                entity.Content = dto.Content;
            }, user.Id));
        }

        public async Task<IResult> GetForCoachAsync(string email)
        {
            var user = await _usersRepository.GetUserByEmail(email);
            if (user == null)
            {
                return Results.NotFound(new { message = "User not found" });
            }
            var filter = Builders<AssignmentResponse>.Filter.Eq(a => a.CreatedBy, user.Id);
            var list = await getWithPopulate(filter);
            return Results.Ok(new {data = list });
        }
        public async Task<List<AssignmentResponse>> GetForCoach(string email)
        {
            var user = await _usersRepository.GetUserByEmail(email);
            if (user == null)
            {
                return null;
            }
            var filter = Builders<AssignmentResponse>.Filter.Eq(a => a.CreatedBy, user.Id);
            var list = await getWithPopulate(filter);
            return list;
        }

        public async Task<IResult> GetForStudent(string email)
        {
            var user = await _usersRepository.GetUserByEmail(email);
            if (user == null)
            {
                return Results.NotFound(new { message = "User not found" });
            }

            if (string.IsNullOrEmpty(user.ClassId))
            {
                return Results.BadRequest(new { message = "User does not belong to any class." });
            }

            var filter = Builders<AssignmentResponse>.Filter.Eq(a => a.ClassId, user.ClassId);
            var list = await getWithPopulate(filter);

            var result = new List<AssignmentResponse>();

           foreach (var assignment in list)
            {
                var submissions = await _assignmentSubmission.Find(s => s.AssignmentId == assignment.Id && s.CreatedBy == user.Id).FirstOrDefaultAsync();
                result.Add(new AssignmentResponse
                {
                    Id = assignment.Id,
                    Title = assignment.Title,
                    Type = assignment.Type,
                    StartTime = assignment.StartTime,
                    DueTime = assignment.DueTime,
                    Content = assignment.Content,
                    CreatedByUser = assignment.CreatedByUser,
                    UpdatedByUser = assignment.UpdatedByUser,
                    StatusSubmission = submissions != null ? submissions.Score != null ? "Graded" : "Submitted" : "Not Submitted"
                });
            }

            return Results.Ok(new {data = list });
        }

        public async Task<IResult> GetAllAsync()
        {
            var list = await getWithPopulate(FilterDefinition<AssignmentResponse>.Empty);
            return Results.Ok(new {data = list });
        }

        public async Task<IResult> GetByAssignmentIdAsync(string id)
        {
            var filter = Builders<AssignmentResponse>.Filter.Eq(a => a.Id, id);

            var result = await getWithPopulate(filter);
            return result == null ? Results.NotFound() : Results.Ok(new {data = result });
        }

        public async Task<IResult> DeleteAsync(string id)
        {
            var deleted = await base.DeleteAsync(id);
            return Results.Ok(deleted);
        }

        public async Task<List<AssignmentResponse>> getWithPopulate(FilterDefinition<AssignmentResponse> filter)
        {
            var serializerRegistry = BsonSerializer.SerializerRegistry;
            var serializer = serializerRegistry.GetSerializer<AssignmentResponse>();

            var renderArgs = new RenderArgs<AssignmentResponse>(serializer, serializerRegistry);
            var renderedFilter = filter.Render(renderArgs);

            var pipeline = new List<BsonDocument>
            {
                new BsonDocument("$match", renderedFilter),
                new BsonDocument(
                    "$lookup",
                    new BsonDocument
                    {
                        { "from", "users" }, // Collection chứa thông tin coach
                        { "localField", "createdBy" }, // Trường trong collection hiện tại (news)
                        { "foreignField", "_id" }, // Trường trong "users" để nối
                        { "as", "createdByUser" }, // Tên field chứa kết quả sau khi join
                    }
                ),
                new BsonDocument(
                    "$set",
                    new BsonDocument
                    {
                        {
                            "createdByUser",
                            new BsonDocument("$arrayElemAt", new BsonArray { "$createdByUser", 0 })
                        },
                    }
                ),
                new BsonDocument(
                    "$lookup",
                    new BsonDocument
                    {
                        { "from", "users" }, // Collection chứa thông tin coach
                        { "localField", "updatedBy" }, // Trường trong collection hiện tại (news)
                        { "foreignField", "_id" }, // Trường trong "users" để nối
                        { "as", "updatedByUser" }, // Tên field chứa kết quả sau khi join
                    }
                ),
                new BsonDocument(
                    "$set",
                    new BsonDocument
                    {
                        {
                            "updatedByUser",
                            new BsonDocument("$arrayElemAt", new BsonArray { "$updatedByUser", 0 })
                        },
                    }
                ),
                new BsonDocument(
                    "$lookup",
                    new BsonDocument
                    {
                        { "from", "class" }, // Collection chứa thông tin coach
                        { "localField", "class_id" }, // Trường trong collection hiện tại (news)
                        { "foreignField", "_id" }, // Trường trong "users" để nối
                        { "as", "class" }, // Tên field chứa kết quả sau khi join
                    }
                ),
                new BsonDocument(
                    "$set",
                    new BsonDocument
                    {
                        {
                            "class",
                            new BsonDocument("$arrayElemAt", new BsonArray { "$class", 0 })
                        },
                    }
                ),
            };

            var result = await _collection.Aggregate<AssignmentResponse>(pipeline).ToListAsync();
            return result;
        }
    }

}
