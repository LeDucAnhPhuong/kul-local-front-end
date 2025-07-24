using kul_local_back_end.Entities;
using kul_local_back_end.models.news;

    public interface INewsRepository : IRepository<News>
    {
    Task<IResult> CreateNewsAsync(CreateNewsDTO dto, string userId);
    Task<IResult> UpdateNewsAsync(string id, UpdateNewsDTO dto, string userId);
    Task<IResult> GetNewsByIdAsync(string id);
    Task<IResult> GetAllNewsAsync(int? page = 1, int? size = 10, string? search = null);
    Task<IResult> DeleteNewsAsync(string id);
    Task<IResult> GetNewsByUserAsync(string email);
    Task<IResult> GetNewsByCoachAsync(string email);
}
