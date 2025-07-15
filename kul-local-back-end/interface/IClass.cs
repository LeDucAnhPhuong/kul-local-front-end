using kul_local_back_end.Entities;
using kul_locall_back_end.Entities;
using kul_locall_back_end.models.classes;

public interface IClass : IRepository<Class>
{

    Task<IResult> GetClassByIdAsync(string id);
    Task<IResult> GetAllClassesAsync(int? pageNumber = 1, int? pageSize = 10, string? search = null);
    Task<IResult> CreateClassAsync(CreateClassDTO classEntity);
    Task<IResult> UpdateClassAsync(string id, UpdateClassDTO classEntity);
    Task<IResult> DeleteClassAsync(string id);
    Task<Class> GetClassById(string class_id);
    Task<List<User>> getAllUserInClass(string class_id);
    Task<IResult> AddMemberToClassAsync(string class_id, string email);
    Task<IResult> RemoveMemberFromClassAsync(string class_id, string email);
    Task<IResult> GetClassesForTedTeamAsync(string email);

}
