using kul_local_back_end.models.quiz;
using kul_local_back_end.Repositories;

public interface IQuizRepository : IRepository<Quiz>
{
    Task<IResult> CreateQuizAsync(CreateQuizDTO quiz, string email);
    Task<IResult> GetAllQuizzesAsync();
    Task<IResult> GetQuizByIdAsync(string id);
    Task<IResult> UpdateQuizAsync(string id, UpdateQuizDTO updatedQuiz, string email);
    Task<IResult> DeleteQuizAsync(string id);
    Task<IResult> GetQuizzesForCoachAsync(string email);
    Task<IResult> GetAvailableQuizzesForStudentAsync(string email);
}