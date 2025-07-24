using kul_local_back_end.Entities;
using kul_local_back_end.models.quiz;
using kul_local_back_end.Repository;
using kul_locall_back_end.repository;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;

namespace kul_local_back_end.Repositories
{
    public class QuizRepository : BaseRepository<Quiz>, IQuizRepository
    {
        private readonly IUserRepository _userRepository;
        private readonly ISchedule _scheduleRepository;
        private readonly IMongoCollection<QuizResult> _quizResultCollection;

        public QuizRepository(
            IMongoDatabase db,
            string collectionName,
            IUserRepository userRepository,
            ISchedule schedule
        )
            : base(db, collectionName)
        {
            _userRepository = userRepository;
            _scheduleRepository = schedule;
            _quizResultCollection = db.GetCollection<QuizResult>("quizResults");
        }

        public async Task<IResult> CreateQuizAsync(CreateQuizDTO createQuiz, string email)
        {
            var coach = await _userRepository.GetUserByEmail(email);
            if (coach == null)
                return Results.NotFound(new { message = "Coach not found." });

            Quiz quiz = new Quiz
            {
                Title = createQuiz.Title,
                Date = createQuiz.Date,
                Due = createQuiz.Due,
                IsPublic = createQuiz.IsPublic,
            };

            await CreateAsync(quiz, coach.Id);
            return Results.Ok(new { message = "Quiz created successfully", data = quiz });
        }

        public async Task<IResult> GetAllQuizzesAsync()
        {
            var quizzes = await GetAllAsync();
            return Results.Ok(new { data = quizzes });
        }

        public async Task<IResult> GetQuizByIdAsync(string id)
        {
            var quiz = await _collection.Find(q => q.Id == id).FirstOrDefaultAsync();
            if (quiz == null)
                return Results.NotFound(new { message = "Quiz not found." });
            return Results.Ok(new { data = quiz });
        }

        public async Task<Quiz> GetQuizById(string id)
        {
            var quiz = await _collection.Find(q => q.Id == id).FirstOrDefaultAsync();
            return quiz;
        }

        public async Task<IResult> UpdateQuizAsync(
            string id,
            UpdateQuizDTO updatedQuiz,
            string email
        )
        {
            var existingQuiz = await _collection.Find(q => q.Id == id).FirstOrDefaultAsync();
            var coach = await _userRepository.GetUserByEmail(email);

            if (existingQuiz == null)
                return Results.NotFound(new { message = "Quiz not found." });
            if (coach == null)
                return Results.NotFound(new { message = "Coach not found." });

            if (existingQuiz.CreatedBy != coach.Id)
                return Results.Forbid();

            var result = await UpdateAsync(
                id,
                quiz =>
                {
                    quiz.Title = updatedQuiz.Title ?? quiz.Title;
                    quiz.Date = updatedQuiz.Date.HasValue ? updatedQuiz.Date.Value : quiz.Date;
                    quiz.Due = updatedQuiz.Due.HasValue ? updatedQuiz.Due.Value : quiz.Due;
                    quiz.IsPublic = updatedQuiz.IsPublic.HasValue
                        ? updatedQuiz.IsPublic.Value
                        : quiz.IsPublic;
                }
            );

            return Results.Ok(new { data = result, message = "Quiz updated successfully." });
        }

        public async Task<IResult> DeleteQuizAsync(string id)
        {
            var result = await DeleteAsync(id);
            if (result == null)
                return Results.NotFound(new { message = "Quiz not found." });
            return Results.Ok(new { message = "Quiz deleted successfully." });
        }

        public async Task<IResult> GetQuizzesForCoachAsync(string email)
        {
            var coach = await _userRepository.GetUserByEmail(email);
            if (coach == null)
                return Results.NotFound(new { message = "Coach not found." });

            var filter = Builders<Quiz>.Filter.Or(
                Builders<Quiz>.Filter.Eq(q => q.CreatedBy, coach.Id),
                Builders<Quiz>.Filter.Eq(q => q.IsPublic, true),
                Builders<Quiz>.Filter.Eq(q => q.IsActive, true)
            );

            var quizzes = await GetByConditionAsync(filter);
            return Results.Ok(new { data = quizzes });
        }

        public async Task<IResult> GetAvailableQuizzesForStudentAsync(string email)
        {
            var user = await _userRepository.GetUserByEmail(email);
            if (user == null || string.IsNullOrEmpty(user.ClassId))
                return Results.NotFound(new { message = "User or class not found." });
            var now = DateTime.UtcNow;
            var today = DateTime.UtcNow.Date;

            // Step 1: Lấy các schedule hôm nay
            var scheduleFilter = Builders<Schedule>.Filter.And(
                Builders<Schedule>.Filter.Eq(s => s.ClassId, user.ClassId),
                Builders<Schedule>.Filter.Gte(s => s.Date, today),
                Builders<Schedule>.Filter.Lt(s => s.Date, today.AddDays(1))
            );
            var schedules = await _scheduleRepository.GetByFilterAsync(scheduleFilter);
            if (!schedules.Any())
                return Results.Ok(new { data = new List<object>() });

            var coachIds = schedules.Select(s => s.CoachId).Distinct().ToList();

            // Step 2: Lấy quiz của các coach theo ngày hợp lệ
            var quizFilter = Builders<Quiz>.Filter.And(
                Builders<Quiz>.Filter.In(q => q.CreatedBy, coachIds)
                //Builders<Quiz>.Filter.Lte(q => q.Date, today),
                //Builders<Quiz>.Filter.Gte(q => q.Due, today)
            );

            var serializerRegistry = BsonSerializer.SerializerRegistry;
            var serializer = serializerRegistry.GetSerializer<Quiz>();

            var renderArgs = new RenderArgs<Quiz>(serializer, serializerRegistry);
            var renderedFilter = quizFilter.Render(renderArgs);

            var pipeline = new List<BsonDocument>
            {
                new BsonDocument("$match", renderedFilter),
                new BsonDocument(
                    "$lookup",
                    new BsonDocument
                    {
                        { "from", "users" },
                        { "localField", "createdBy" },
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

            var quizzes = await _collection.Aggregate<QuizResponsive>(pipeline).ToListAsync();
            if (!quizzes.Any())
                return Results.Ok(new { data = new List<object>() });

            var quizIds = quizzes.Select(q => q.Id).ToList();

            var resultFilter = Builders<QuizResult>.Filter.And(
                Builders<QuizResult>.Filter.Eq(r => r.UserId, user.Id),
                Builders<QuizResult>.Filter.In(r => r.QuizId, quizIds)
            );

            var submittedResults = await _quizResultCollection.Find(resultFilter).ToListAsync();
            var submittedQuizIds = submittedResults.Select(r => r.QuizId).ToHashSet();

            var resultData = quizzes.Select(async q => new
            {
                q.Id,
                q.Title,
                q.Date,
                q.Due,
                q.IsPublic,
                q.CreatedBy,
                q.Coach,
                q.IsActive,
                status = submittedQuizIds.Contains(q.Id) ? "done" : q.Date > now ? "upcoming" : q.Due < now ? "cant_start" : "not_yet",
            });

            return Results.Ok(new { data = await Task.WhenAll(resultData) });
        }
    }
}
