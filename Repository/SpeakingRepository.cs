using kul_local_back_end.Entities;
using kul_local_back_end.Models.Speaking;
using MongoDB.Driver;

namespace kul_local_back_end.Repository
{
    public class SpeakingRepository : BaseRepository<Speaking>, ISpeakingRepository
    {
        private readonly UsersRepository _userRepository;
        public SpeakingRepository(IMongoDatabase db, UsersRepository usersRepository) : base(db, "speaking") {
            
            _userRepository = usersRepository;
        }

        public async Task<IResult> CreateSpeakingAsync(CreateSpeakingDTO dto, string email)
        {
            var user = await _userRepository.GetUserByEmail(email);

            if (user == null)
            {
                return Results.NotFound(new { message = "User not found" });
            }

            var exist_speaking = _collection.Find(s => s.CreatedBy == user.Id && s.Question == dto.Question).FirstOrDefault();

            if (exist_speaking != null)
            {
                return Results.BadRequest(new { message = "You have already submitted an answer for this question." });
            }

            var speaking = new Speaking
            {
                Question = dto.Question,
                Answer = dto.Answer,
                Score = dto.Score,
            };

            await CreateAsync(speaking, user.Id);
            return Results.Ok(new { message = "Speaking saved", data = speaking });
        }

        public async Task<IResult> GetLeaderboardAsync(DateTime from, DateTime to, string email)
        {

            var user = await _userRepository.GetUserByEmail(email);

            if (user == null)
            {
                return Results.NotFound(new { message = "User not found" });
            }

            var filter = Builders<Speaking>.Filter.And(
                Builders<Speaking>.Filter.Gte(s => s.CreatedAt, from),
                Builders<Speaking>.Filter.Lte(s => s.CreatedAt, to)
            );

            var speakings = await _collection.Find(filter).ToListAsync();

            var leaderboard = (await Task.WhenAll(
                speakings
                .GroupBy(s => s.CreatedBy)
                .Select(async g =>  new
                {
                    UserId = await _userRepository.GetByIdAsync(g.Key),
                    TotalAttempts = g.Count(),
                    AverageScore = Math.Round(g.Average(x => x.Score), 2),
                    BestScore = g.Max(x => x.Score),
                    LatestScore = g.OrderByDescending(x => x.CreatedAt).FirstOrDefault()?.Score,
                    Me = g.Key == user.Id
                })))
                .OrderByDescending(x => x.BestScore)
                .ToList();

            return Results.Ok(new {data = leaderboard });
        }
    }
}
