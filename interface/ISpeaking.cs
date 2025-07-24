using kul_local_back_end.Entities;
using kul_local_back_end.Models.Speaking;

namespace kul_local_back_end.Repository
{
    public interface ISpeakingRepository : IRepository<Speaking>
    {
        Task<IResult> CreateSpeakingAsync(CreateSpeakingDTO dto, string email);
        Task<IResult> GetLeaderboardAsync(DateTime from, DateTime to, string email);
    }
}
