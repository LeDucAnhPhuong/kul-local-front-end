using kul_local_back_end.Entities;
using MongoDB.Driver;

namespace kul_local_back_end.Repository
{
    public class BaseRepository<T> : IRepository<T> where T : baseEntity
    {
        protected readonly IMongoCollection<T> _collection;

        public BaseRepository(IMongoDatabase database, string collectionName)
        {
            _collection = database.GetCollection<T>(collectionName);
        }

        public async Task<T> CreateAsync(T entity, string? userId = null)
        {
            if (userId != null)
            {
                entity.CreatedBy = userId;
                entity.UpdatedBy = userId;
                entity.CreatedAt = DateTime.UtcNow;
            }
            await _collection.InsertOneAsync(entity);
            return entity;
        }

        public async Task<T> UpdateOneAsync(FilterDefinition<T> filter, UpdateDefinition<T> update, string? userId = null)
        {
            update = Builders<T>.Update.Combine(
                update,
                Builders<T>.Update.Set(e => e.UpdatedBy, userId),
                Builders<T>.Update.Set(e => e.UpdatedAt, DateTime.UtcNow)
            );

            var options = new FindOneAndUpdateOptions<T>
            {
                ReturnDocument = ReturnDocument.After
            };

            var entity = await _collection.FindOneAndUpdateAsync(filter, update, options);
            return entity;
        }

        public async Task<T> UpdateAsync(string id, Action<T> updateAction, string? userId = null)
        {
            var entity = await GetByIdAsync(id);
            if (entity == null) throw new KeyNotFoundException("Entity not found");

            updateAction(entity);

            if (userId != null)
            {
                entity.UpdatedBy = userId;
                entity.UpdatedAt = DateTime.UtcNow;
            }

            await _collection.ReplaceOneAsync(e => e.Id == id, entity);
            return entity;
        }

        public async Task<T> GetByIdAsync(string id)
        {
            return await _collection.Find(e => e.Id == id).FirstOrDefaultAsync();
        }

        public async Task<List<T>> GetAllAsync(FilterDefinition<T>? filter = null, int? pageNumber = 1, int? pageSize = 10, string? search = null)
        {
            filter ??= Builders<T>.Filter.Empty;

            if (!string.IsNullOrEmpty(search))
            {
                // Assuming a "Name" field for search, adjust as needed
                var searchFilter = Builders<T>.Filter.Regex("Name", new MongoDB.Bson.BsonRegularExpression(search, "i"));
                filter = Builders<T>.Filter.And(filter, searchFilter);
            }

            return await _collection.Find(filter)
                .Skip((pageNumber - 1) * pageSize)
                .Limit(pageSize)
                .ToListAsync();
        }


        public async Task<List<T>> GetByConditionAsync(FilterDefinition<T> condition)
        {
            return await _collection.Find(condition).ToListAsync();
        }

        public async Task<List<T>> GetByFilterAsync(FilterDefinition<T> filter)
        {
            return await _collection.Find(filter).ToListAsync();
        }

        public async Task<T> DeleteAsync(string id)
        {
            var entity = await GetByIdAsync(id);
            if (entity == null) throw new KeyNotFoundException("Entity not found");

            // Correcting the UpdateOneAsync call to properly set the isActive field to false
            var update = Builders<T>.Update.Set(e => e.IsActive, !entity.IsActive);
            await _collection.UpdateOneAsync(e => e.Id == id, update);
           
            return entity;
        }

        public IMongoCollection<T> GetCollection()
        {
            return _collection;
        }
       
    }
}
