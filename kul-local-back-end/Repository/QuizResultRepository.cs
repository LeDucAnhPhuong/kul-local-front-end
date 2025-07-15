using kul_local_back_end.Entities;
using kul_local_back_end.models.quizResult;
using kul_local_back_end.Repository;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;

namespace kul_local_back_end.Repositories
{

    public class QuizResultRepository : BaseRepository<QuizResult>, IQuizResultRepository
    {
        private readonly UsersRepository _usersRepository;
        private readonly QuestionRepository _questionRepository;
        private readonly QuizRepository _quizRepository;
        private readonly ILogger<QuizResultRepository> _logger;
        public QuizResultRepository(IMongoDatabase db, string collectionName, UsersRepository usersRepository, QuestionRepository questionRepository, QuizRepository quizRepository, ILogger<QuizResultRepository> logger) : base(db, collectionName)
        {
            _usersRepository = usersRepository;
            _questionRepository = questionRepository;
            _quizRepository = quizRepository;
            _logger = logger;
        }

        public async Task<Boolean> existQuizResult(string quizId, string userId)
        {
            var filter = Builders<QuizResult>.Filter.And(
                Builders<QuizResult>.Filter.Eq(r => r.QuizId, quizId),
                Builders<QuizResult>.Filter.Eq(r => r.UserId, userId)
            );
            var result = await _collection.Find(filter).FirstOrDefaultAsync();
            return result != null;
        }

       public async Task<IResult> SubmitQuizResultAsync(CreateQuizResultDTO result, string email)
{
    var user = await _usersRepository.GetUserByEmail(email);
    if (user == null)
        return Results.NotFound(new { message = "User not found." });

            if (await existQuizResult(result.QuizId, user.Id))
                return Results.BadRequest(new { message = "Quiz result already submitted." });

            var quiz = await _quizRepository.GetByIdAsync(result.QuizId);
    if (quiz == null)
        return Results.BadRequest(new { message = "Quiz not found." });

    if (quiz.Due < DateTime.UtcNow)
        return Results.BadRequest(new { message = "Quiz has expired." });

    var questions = await _questionRepository.GetByFilterAsync(
        Builders<Question>.Filter.Eq(q => q.QuizId, result.QuizId));

    double totalScore = 0;

    foreach (var answer in result.Answers)
    {
        var question = questions.FirstOrDefault(q => q.Id == answer.QuestionId);
          if (question == null || !question.IsActive) continue;


        double questionScore = question.Type switch
        {
            QuestionType.SingleChoice =>
                !string.IsNullOrEmpty(answer.SelectedOption) &&
                question.Options?.CorrectAnswers?.Contains(answer.SelectedOption) == true ? 1 : 0,

            QuestionType.MultipleChoice =>
                answer.SelectedOptions.Count > 0 && question.Options?.CorrectAnswers != null ?
                answer.SelectedOptions.Intersect(question.Options.CorrectAnswers).Count() / (double)question.Options.CorrectAnswers.Count : 0,

            QuestionType.PairKey =>
                question.Pairs?.CorrectAnswers != null && answer.MatchedPairs.Count > 0 ?
                answer.MatchedPairs.Count(pair =>
                    question.Pairs.CorrectAnswers.Any(correct =>
                        correct.Count == 2 && correct[0] == pair.Left && correct[1] == pair.Right))
                / (double)question.Pairs.CorrectAnswers.Count : 0,

            QuestionType.Fillblank  =>
                question.FillInBlank?.CorrectAnswers != null && answer.TextAnswers.Count > 0 ?
                answer.TextAnswers.Count(ans => question.FillInBlank.CorrectAnswers.Contains(ans)) /
                (double)question.FillInBlank.CorrectAnswers.Count : 0,

            QuestionType.SelectInText =>
               question.SelectContent?.Options != null && answer.TextAnswers.Count > 0 ?
               answer.TextAnswers.Count(ans =>
                   question.SelectContent.Options.Any(opt => opt.CorrectAnswer == ans)) /
               (double)question.SelectContent.Options.Count : 0,
            _ => 0
        };
         
        totalScore += questionScore;
    }

            int questionCount = questions.Count(q => q.IsActive);


    double score = questions.Count > 0 ? Math.Round((totalScore * 10.0) / questionCount, 2) : 0;

    var quizResult = new QuizResult
    {
        QuizId = result.QuizId,
        UserId = user.Id,
        Answers = result.Answers.Select(a => new AnswerSubmission
        {
            QuestionId = a.QuestionId,
            SelectedOption = a.SelectedOption,
            SelectedOptions = a.SelectedOptions,
            MatchedPairs = a.MatchedPairs.Select(p => new PairMatch { Left = p.Left, Right = p.Right }).ToList(),
            TextAnswers = a.TextAnswers
        }).ToList(),
        Score = score,
        SubmittedAt = DateTime.UtcNow
    };

    await _collection.InsertOneAsync(quizResult);

    return Results.Ok(new { message = "Quiz result submitted", score });
}


        public async Task<IResult> GetResultsByUserAsync(string email)
        {
            var user = await _usersRepository.GetUserByEmail(email);
            var filter = Builders<QuizResult>.Filter.Eq(r => r.UserId, user.Id);
            var results = await _collection.Find(filter).ToListAsync();
            return Results.Ok(new { data = results });
        }

        public async Task<IResult> GetResultsByQuizAsync(string quizId)
        {
            var filter = Builders<QuizResult>.Filter.Eq(r => r.QuizId, quizId);
            var results = await _collection.Find(filter).ToListAsync();
            return Results.Ok(new { data = results });
        }
    }
}
