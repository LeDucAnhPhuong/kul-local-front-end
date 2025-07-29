using kul_local_back_end.Entities;
using kul_locall_back_end.Entities;
using MongoDB.Driver;
public interface IRepository<T> where T : baseEntity
{
    Task<T> CreateAsync(T entity, string? userId = null);
    Task<T> UpdateAsync(string id, Action<T> updateAction, string? userId = null);
    Task<T> GetByIdAsync(string id);
    Task<List<T>> GetAllAsync(FilterDefinition<T>? filter = null, int? pageNumber = 1, int? pageSize = 10, string? search = null);
    Task<List<T>> GetByConditionAsync(FilterDefinition<T> condition);
    Task<List<T>> GetByFilterAsync(FilterDefinition<T> filter);
    Task<T> DeleteAsync(string id);
    IMongoCollection<T> GetCollection();
}
