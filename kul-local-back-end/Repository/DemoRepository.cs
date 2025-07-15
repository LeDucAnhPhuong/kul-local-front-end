using kul_local_back_end.Repository;
using kul_locall_back_end.Entities;
using MongoDB.Driver;

namespace kul_locall_back_end.repository
{
    public class DemoRepository : BaseRepository<Demo>
    {
        public DemoRepository(IMongoDatabase database, string collectionName)
            : base(database, collectionName)
        {
        }
    }
}
