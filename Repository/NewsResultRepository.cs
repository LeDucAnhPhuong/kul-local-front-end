using kul_local_back_end.Entities;
using kul_local_back_end.models.news;
using MongoDB.Driver;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace kul_local_back_end.Repository
{
    public class NewsResultRepository : BaseRepository<NewsResult>, INewsResultRepository
    {
        private readonly NewsRepository _newsRepository;
        private readonly UsersRepository _usersRepository;
        public NewsResultRepository(IMongoDatabase db, NewsRepository newsRepository, UsersRepository usersRepository) : base(db, "news_results") {
            _newsRepository = newsRepository;
            _usersRepository = usersRepository;

        }

        public async Task<IResult> CreateNewsResultAsync(CreateNewsResultDTO dto, string coachId)
        {
            var existing = await _collection.Find(r => r.NewsId == dto.NewsId).FirstOrDefaultAsync();
            if (existing != null)
                return Results.BadRequest(new { message = "Already scored." });

            var news = await _newsRepository.GetNewsById(dto.NewsId);

            if (news == null)
                return Results.NotFound(new { message = "News not found." });

            var result = new NewsResult
            {
                NewsId = dto.NewsId,
                Score = dto.Score,
                Feedback = dto.Feedback,
            };

            await CreateAsync(result, news.CoachId);
            return Results.Ok(result);
        }

        public async Task<IResult> GetNewsResultByNewsIdAsync(string newsId)
        {
            var result = await _collection.Find(r => r.NewsId == newsId).FirstOrDefaultAsync();
            return result == null ? Results.NotFound() : Results.Ok(result);

        }

        public async Task<IResult> GetNewsResultForStudentAsync(string email)
        {

            var newsList = await _newsRepository.GetNewsByUser(email);

            if (newsList == null || !newsList.Any())
                return Results.NotFound(new { message = "No news found for this user." });

            var newsIds = newsList.Select(n => n.Id).ToList();

            var data = await _collection.Find(r => newsIds.Contains(r.NewsId)).ToListAsync();
            return Results.Ok(new { data });
        }

        public async Task<IResult> GetNewsResultForCoachAsync(string email)
        {
            var newsList = await _newsRepository.GetNewsByCoach(email);

            if (newsList == null || !newsList.Any())
                return Results.NotFound(new { message = "No news found for this user." });

            var newsIds = newsList.Select(n => n.Id).ToList();

            var data = await _collection.Find(r => newsIds.Contains(r.NewsId)).ToListAsync();
            return Results.Ok(new { data });
        }
    }
}
