using kul_local_back_end.Entities;
using kul_local_back_end.models.quizResult;

public interface IQuizResultRepository : IRepository<QuizResult>
{
    Task<IResult> SubmitQuizResultAsync(CreateQuizResultDTO result, string email);
    Task<IResult> GetResultsByUserAsync(string userId);
    Task<IResult> GetResultsByQuizAsync(string quizId);
}