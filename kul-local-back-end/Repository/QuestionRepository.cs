using kul_local_back_end.Entities;
using kul_local_back_end.models.question;
using kul_local_back_end.Repository;
using MongoDB.Driver;

namespace kul_local_back_end.Repositories
{

    public class QuestionRepository : BaseRepository<Question>, IQuestionRepository
    {
        private readonly QuizRepository _quizRepository;
        public QuestionRepository(IMongoDatabase db, string collectionName, QuizRepository quizRepository) : base(db, collectionName)
        {
            _quizRepository = quizRepository;
        }

        public async Task<IResult> CreateQuestionAsync(CreateQuestionDTO question)
        {
            var quiz = await _quizRepository.GetQuizById(question.QuizId);

            if (quiz == null)
            {
                return Results.NotFound(new { message = "Quiz not found." });
            }

            var newQuestion = new Question
            {
                QuizId = question.QuizId,
                Type = question.Type,
                QuestionText = question.QuestionText,
                Options = question.Options,
                SelectContent = question.SelectContent,
                Pairs = question.Pairs,
                FillInBlank = question.FillInBlank,
            };
            var result = await CreateAsync(newQuestion);

            return result != null
                ? Results.Ok(new { message = "Question created successfully", data = result })
                : Results.BadRequest(new { message = "Failed to create question" });
        }

        public async Task<IResult> UpdateQuestionAsync(string id, UpdateQuestionDTO updateAction)
        {
            var result =  await UpdateAsync(id, question =>
            {
                question.QuestionText = updateAction.QuestionText ?? question.QuestionText;
                question.Options = updateAction.Options != null ? updateAction.Options : question.Options;
                question.SelectContent = updateAction.SelectContent ?? question.SelectContent;
                question.Pairs = updateAction.Pairs ?? question.Pairs;
                question.FillInBlank = updateAction.FillInBlank ?? question.FillInBlank;

            });

            if(result == null)
            {
                return Results.NotFound(new { message = "Question not found." });
            }

            return Results.Ok(new { message = "Question updated successfully", data = result });
        }

        public async Task<IResult> GetQuestionByIdAsync(string id)
        {

            var question = await GetByIdAsync(id);

            if (question == null)
            {
                return Results.NotFound(new { message = "Question not found." });
            }

            return Results.Ok(new { data = question });
        }

        public async Task<IResult> GetQuestionsByQuizIdAsync(string quizId)
        {
            var filter = Builders<Question>.Filter.Eq(q => q.QuizId, quizId);
            var results = await GetByFilterAsync(filter);
            return Results.Ok(new { data = results });
        }

        public async Task<IResult> DeleteQuestionAsync(string id)
        {
            var question = await DeleteAsync(id);
            if (question == null)
            {
                return Results.NotFound(new { message = "Question not found." });
            }

            return Results.Ok(new { message = "Question deleted successfully", data = question });
        }
    }
}
