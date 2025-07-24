using kul_local_back_end.Entities;
using kul_local_back_end.models.news;

public interface INewsResultRepository : IRepository<NewsResult>
{
    Task<IResult> CreateNewsResultAsync(CreateNewsResultDTO dto, string coachId);
    Task<IResult> GetNewsResultByNewsIdAsync(string newsId);
    Task<IResult> GetNewsResultForStudentAsync(string email);
    Task<IResult> GetNewsResultForCoachAsync(string email);
}