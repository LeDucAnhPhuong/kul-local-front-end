using kul_local_back_end.Entities;
using kul_local_back_end.models.question;

public interface IQuestionRepository : IRepository<Question>
{
    Task<IResult> CreateQuestionAsync(CreateQuestionDTO question);
    Task<IResult> UpdateQuestionAsync(string id, UpdateQuestionDTO updateAction);
    Task<IResult> GetQuestionByIdAsync(string id);
    Task<IResult> GetQuestionsByQuizIdAsync(string quizId);
    Task<IResult> DeleteQuestionAsync(string id);
    Task<IResult> ImportQuestions(string quizId, IFormFile file);
    Task<IResult> ExportQuestions(string quizId);
}