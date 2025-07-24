using kul_local_back_end.Entities;
using kul_local_back_end.models.news;
using MongoDB.Bson;
using MongoDB.Driver;

namespace kul_local_back_end.Repository
{
    public class NewsRepository : BaseRepository<News>, INewsRepository
    {
        private readonly UsersRepository _usersRepo;
        private readonly IMongoCollection<NewsResult> _newResult;

        public NewsRepository(
            IMongoDatabase db,
            string collectionName,
            UsersRepository usersRepository
        )
            : base(db, collectionName)
        {
            _usersRepo = usersRepository;
            _newResult = db.GetCollection<NewsResult>("news_results");
        }

        public async Task<IResult> CreateNewsAsync(CreateNewsDTO dto, string email)
        {
            var user = await _usersRepo.GetUserByEmail(email);

            if (user == null)
                return Results.NotFound(new { message = "User not found" });

            // Chọn coach có số bài chấm ít nhất
            var coachGroups = await _collection
                .Aggregate()
                .Group(n => n.CoachId, g => new { CoachId = g.Key, Count = g.Count() })
                .ToListAsync();

            var allCoaches = await _usersRepo.GetByConditionAsync(
                Builders<User>.Filter.And(
                    Builders<User>.Filter.Eq(u => u.Role, UserRole.Coach.ToString()),
                    Builders<User>.Filter.Eq(u => u.IsActive, true)
                )
            );

            var targetCoach = allCoaches
                .OrderBy(c => coachGroups.FirstOrDefault(g => g.CoachId == c.Id)?.Count ?? 0)
                .FirstOrDefault();

            if (targetCoach == null)
                return Results.BadRequest(new { message = "No coach available" });

            var news = new News
            {
                Title = dto.Title,
                ImageUrl = dto.ImageUrl,
                Content = dto.Content,
                CoachId = targetCoach.Id,
            };

            var result = await CreateAsync(news, user.Id);
            return Results.Ok(result);
        }

        public async Task<IResult> UpdateNewsAsync(string id, UpdateNewsDTO dto, string email)
        {
            var user = await _usersRepo.GetUserByEmail(email);

            if (user == null)
                return Results.NotFound(new { message = "User not found" });

            var news = await UpdateAsync(
                id,
                n =>
                {
                    n.Title = dto.Title;
                    n.ImageUrl = dto.ImageUrl;
                    n.Content = dto.Content;
                },
                user.Id
            );
            return Results.Ok(news);
        }

        public async Task<IResult> GetNewsByIdAsync(string id)
        {
            var news = await GetByIdAsync(id);
            return news != null ? Results.Ok(new { data = news }) : Results.NotFound();
        }

        public async Task<News> GetNewsById(string id)
        {
            var news = await GetByIdAsync(id);
            return news;
        }

        public async Task<IResult> GetAllNewsAsync(
            int? page = 1,
            int? size = 10,
            string? search = null
        )
        {
            var pipeline = new List<BsonDocument>
            {
                // Optional match filter
                // new BsonDocument("$match", new BsonDocument("isActive", true)),

                new BsonDocument(
                    "$lookup",
                    new BsonDocument
                    {
                        { "from", "users" }, // Collection chứa thông tin coach
                        { "localField", "createdBy" }, // Trường trong collection hiện tại (news)
                        { "foreignField", "_id" }, // Trường trong "users" để nối
                        { "as", "createdByUser" }, // Tên field chứa kết quả sau khi join
                    }
                ),
                new BsonDocument(
                    "$set",
                    new BsonDocument
                    {
                        {
                            "createdByUser",
                            new BsonDocument("$arrayElemAt", new BsonArray { "$createdByUser", 0 })
                        },
                    }
                ),
                new BsonDocument(
                    "$lookup",
                    new BsonDocument
                    {
                        { "from", "users" }, // Collection chứa thông tin coach
                        { "localField", "updatedBy" }, // Trường trong collection hiện tại (news)
                        { "foreignField", "_id" }, // Trường trong "users" để nối
                        { "as", "updatedByUser" }, // Tên field chứa kết quả sau khi join
                    }
                ),
                new BsonDocument(
                    "$set",
                    new BsonDocument
                    {
                        {
                            "updatedByUser",
                            new BsonDocument("$arrayElemAt", new BsonArray { "$updatedByUser", 0 })
                        },
                    }
                ),
            };

            var result = await _collection.AggregateAsync<News>(pipeline);
            var list = await result.ToListAsync();

            return Results.Ok(new { data = list });
        }

        public async Task<IResult> DeleteNewsAsync(string id)
        {
            var deleted = await DeleteAsync(id);
            return Results.Ok(deleted);
        }

        public async Task<IResult> GetNewsByUserAsync(string email)
        {
            var user = await _usersRepo.GetUserByEmail(email);

            if (user == null)
                return Results.NotFound(new { message = "User not found" });

            var data = await GetByFilterAsync(Builders<News>.Filter.Eq(n => n.CreatedBy, user.Id));
            var result = await Task.WhenAll(
                data.Select(async n => new NewsResponse
                {
                    Id = n.Id,
                    Title = n.Title,
                    ImageUrl = n.ImageUrl,
                    Content = n.Content,
                    CoachId = n.CoachId,
                    CreatedBy = n.CreatedBy,
                    CreatedAt = n.CreatedAt,
                    Result = await _newResult.Find(r => r.NewsId == n.Id).FirstOrDefaultAsync(),
                })
            );
            return Results.Ok(new { data = result.ToList() });
        }

        public async Task<List<NewsResponse>> GetNewsByUser(string email)
        {
            var user = await _usersRepo.GetUserByEmail(email);

            if (user == null)
                return null;

            var data = await GetByFilterAsync(Builders<News>.Filter.Eq(n => n.CreatedBy, user.Id));
            var result = await Task.WhenAll(
                data.Select(async n => new NewsResponse
                {
                    Id = n.Id,
                    Title = n.Title,
                    ImageUrl = n.ImageUrl,
                    Content = n.Content,
                    CoachId = n.CoachId,
                    CreatedBy = n.CreatedBy,
                    CreatedAt = n.CreatedAt,
                    Result = await _newResult.Find(r => r.NewsId == n.Id).FirstOrDefaultAsync(),
                })
            );
            return result.ToList();
        }

        public async Task<IResult> GetNewsByCoachAsync(string email)
        {
            var coach = await _usersRepo.GetUserByEmail(email);

            if (coach == null)
                return Results.NotFound(new { message = "User not found" });

            var data = await GetByFilterAsync(Builders<News>.Filter.Eq(n => n.CoachId, coach.Id));

            var result = await Task.WhenAll(
                data.Select(async n => new NewsResponse
                {
                    Id = n.Id,
                    Title = n.Title,
                    ImageUrl = n.ImageUrl,
                    Content = n.Content,
                    CoachId = n.CoachId,
                    CreatedBy = n.CreatedBy,
                    CreatedAt = n.CreatedAt,
                    Result = await _newResult.Find(r => r.NewsId == n.Id).FirstOrDefaultAsync(),
                })
            );

            return Results.Ok(new { data = result.ToList() });
        }

        public async Task<List<NewsResponse>> GetNewsByCoach(string email)
        {
            var coach = await _usersRepo.GetUserByEmail(email);

            if (coach == null)
                return null;

            var data = await GetByFilterAsync(Builders<News>.Filter.Eq(n => n.CoachId, coach.Id));
            var result = await Task.WhenAll(
                data.Select(async n => new NewsResponse
                {
                    Id = n.Id,
                    Title = n.Title,
                    ImageUrl = n.ImageUrl,
                    Content = n.Content,
                    CoachId = n.CoachId,
                    CreatedBy = n.CreatedBy,
                    CreatedAt = n.CreatedAt,
                    Result = await _newResult.Find(r => r.NewsId == n.Id).FirstOrDefaultAsync(),
                })
            );
            return result.ToList();
        }
    }
}
