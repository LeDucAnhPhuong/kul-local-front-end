using kul_local_back_end.Entities;
using kul_local_back_end.models.assignment;
using kul_local_back_end.Repository;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;

public class AssignmentSubmissionRepository : BaseRepository<AssignmentSubmission>, IAssignmentSubmissionRepository
{
    private readonly UsersRepository _userRepository;
    private readonly AssignmentRepository _assignmentsRepository;

    public AssignmentSubmissionRepository(IMongoDatabase db, UsersRepository usersRepository, AssignmentRepository assignmentRepository) : base(db, "assignment_submissions")
    {
        _userRepository = usersRepository;
        _assignmentsRepository = assignmentRepository;
    }

    public async Task<IResult> SubmitAsync(CreateAssignmentSubmissionDTO dto, string studentEmail)
    {
        var student = await _userRepository.GetUserByEmail(studentEmail);

        if (student == null) return Results.NotFound(new { message = "Student not found." });

        var exist = await _collection.Find(s =>
            s.AssignmentId == dto.AssignmentId &&
            s.CreatedBy == student.Id).FirstOrDefaultAsync();

        if (exist != null) return Results.BadRequest(new { message = "Already submitted." });

        var assignment = await _assignmentsRepository.GetByIdAsync(dto.AssignmentId);

        if (assignment == null) return Results.NotFound(new { message = "Assignment not found." });

        var now = DateTime.UtcNow;

        if (now < assignment.StartTime || now > assignment.DueTime)
        {
            return Results.BadRequest(new { message = "Submission is not allowed outside the assignment time frame." });
        }


        var submission = new AssignmentSubmission
        {
            AssignmentId = dto.AssignmentId,
            Content = dto.Content,
            SubmittedAt = DateTime.UtcNow
        };

        await CreateAsync(submission, student.Id);
        return Results.Ok(new { message = "Submitted", data = submission });
    }

    public async Task<IResult> UpdateSubmissionAsync(string submissionId, UpdateAssignmentSubmissionDTO dto, string studentEmail)
    {
        var student = await _userRepository.GetUserByEmail(studentEmail);
        if (student == null) return Results.NotFound();

        var submission = await _collection.Find(s => s.Id == submissionId).FirstOrDefaultAsync();

        var assignment = await _assignmentsRepository.GetByIdAsync(submission.AssignmentId);

        if (assignment == null) return Results.NotFound(new { message = "Assignment not found." });

        var now = DateTime.UtcNow;

        if (now < assignment.StartTime || now > assignment.DueTime)
        {
            return Results.BadRequest(new { message = "Submission is not allowed outside the assignment time frame." });
        }


        var filter = Builders<AssignmentSubmission>.Filter.And(
            Builders<AssignmentSubmission>.Filter.Eq(s => s.Id, submissionId),
            Builders<AssignmentSubmission>.Filter.Eq(s => s.CreatedBy, student.Id)
        );

        var update = Builders<AssignmentSubmission>.Update
            .Set(s => s.Content, dto.Content)
            .Set(s => s.UpdatedAt, DateTime.UtcNow)
            .Set(s => s.SubmittedAt, DateTime.UtcNow);

        var result = await UpdateOneAsync(filter, update, student.Id);

        return result != null
            ? Results.Ok(new { message = "Updated" })
            : Results.NotFound();
    }

    public async Task<IResult> GradeAsync(string submissionId, GradeSubmissionDTO dto)
    {
        var update = Builders<AssignmentSubmission>.Update
            .Set(s => s.Score, dto.Score)
            .Set(s => s.Feedback, dto.Feedback)
            .Set(s => s.UpdatedAt, DateTime.UtcNow);

        var result = await _collection.UpdateOneAsync(s => s.Id == submissionId, update);

        return result.ModifiedCount > 0
            ? Results.Ok(new { message = "Graded" })
            : Results.NotFound();
    }

    public async Task<IResult> GetStudentSubmissions(string studentEmail)
    {
        var student = await _userRepository.GetUserByEmail(studentEmail);
        if (student == null) return Results.NotFound();

        var filter = Builders<AssignmentSubmissionResponse>.Filter.Eq(s => s.CreatedBy, student.Id);

        var submissions = await getWithPopulate(filter);

        return Results.Ok(submissions);
    }

    public async Task<IResult> GetStudentSubmissionsByAssignment(string studentEmail, string assignmentId)
    {
        var student = await _userRepository.GetUserByEmail(studentEmail);
        if (student == null) return Results.NotFound();

        var filter = Builders<AssignmentSubmission>.Filter.And(
             Builders <AssignmentSubmission>.Filter.Eq(s => s.AssignmentId, assignmentId),
             Builders <AssignmentSubmission>.Filter.Eq(s => s.CreatedBy, student.Id)
        );

        var exist = await _collection.Find(filter).FirstOrDefaultAsync();

        if(exist != null)
        {
            var filterAssignmentSubmission = Builders<AssignmentSubmissionResponse>.Filter.And(
             Builders<AssignmentSubmissionResponse>.Filter.Eq(s => s.AssignmentId, assignmentId),
             Builders<AssignmentSubmissionResponse>.Filter.Eq(s => s.CreatedBy, student.Id)
        );

            var submissions = await getWithPopulate(filterAssignmentSubmission);

        return Results.Ok(new {data = submissions });
        }
        else
        {
            var assignmnetFilter = Builders<AssignmentResponse>.Filter.And(
                Builders<AssignmentResponse>.Filter.Eq(a => a.Id, assignmentId)
               );

            var assignment = await _assignmentsRepository.getWithPopulate(assignmnetFilter);
            return Results.Ok(new
            {
                message = "No submission found for this assignment",
                data = assignment.FirstOrDefault()
            });
        }
    }

    public async Task<IResult> GetCoachAssignmentSubmissions(string email, string assignmentId)
    {
        var coach = await _userRepository.GetUserByEmail(email);

        if (coach == null) return Results.NotFound(new { message = "Coach not found." });
        var assignment = await _assignmentsRepository.GetByIdAsync(assignmentId);

        if (assignment == null) return Results.NotFound(new { message = "Assignment not found." });

        if(assignment.CreatedBy != coach.Id)
        {
            return Results.BadRequest(new { message = "Coach does not have access to this assignment." });
        }


        var filter = Builders<AssignmentSubmissionResponse>.Filter.Eq(s => s.AssignmentId, assignmentId);

        var submissions = await getWithPopulate(filter);

        return Results.Ok(new {data = submissions });
    }

    public async Task<IResult> GetAssignmentSubmissionsByAssignmentId(string assignmentId)
    {

        var filter = Builders<AssignmentSubmission>.Filter.And(
             Builders<AssignmentSubmission>.Filter.Eq(s => s.AssignmentId, assignmentId)
        );

        var exist = await _collection.Find(filter).FirstOrDefaultAsync();

        if (exist != null)
        {
            var filterAssignmentSubmission = Builders<AssignmentSubmissionResponse>.Filter.And(
             Builders<AssignmentSubmissionResponse>.Filter.Eq(s => s.AssignmentId, assignmentId)
        );

            var submissions = await getWithPopulate(filterAssignmentSubmission);
            var result = new
            {
                AssignmentId = assignmentId,
                Assignment = submissions.FirstOrDefault()?.Assignment,
                Submissions = submissions.FirstOrDefault(),
            };

            return Results.Ok(new { data = result });
        }
        else
        {
            var assignmnetFilter = Builders<AssignmentResponse>.Filter.And(
                Builders<AssignmentResponse>.Filter.Eq(a => a.Id, assignmentId)
               );

            var assignment = await _assignmentsRepository.getWithPopulate(assignmnetFilter);
            var assignmentSubmission = new 
            {
                AssignmentId = assignmentId,
                Assignment = assignment.FirstOrDefault(),
                Submissions = (object?)null
            };
            return Results.Ok(new
            {
                message = "No submission found for this assignment",
                data = assignmentSubmission
            });
        }
    }

    public async Task<List<AssignmentSubmissionResponse>> getWithPopulate(FilterDefinition<AssignmentSubmissionResponse> filter)
    {
        var serializerRegistry = BsonSerializer.SerializerRegistry;
        var serializer = serializerRegistry.GetSerializer<AssignmentSubmissionResponse>();

        var renderArgs = new RenderArgs<AssignmentSubmissionResponse>(serializer, serializerRegistry);
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
                        { "from", "assignments" }, // Collection chứa thông tin coach
                        { "localField", "assignment_id" }, // Trường trong collection hiện tại (news)
                        { "foreignField", "_id" }, // Trường trong "users" để nối
                        { "as", "assignment" }, // Tên field chứa kết quả sau khi join
                    }
                ),
                new BsonDocument(
                    "$set",
                    new BsonDocument
                    {
                        {
                            "assignment",
                            new BsonDocument("$arrayElemAt", new BsonArray { "$assignment", 0 })
                        },
                    }
                ),
            };

        var result = await _collection.Aggregate<AssignmentSubmissionResponse>(pipeline).ToListAsync();
        return result;
    }
}
