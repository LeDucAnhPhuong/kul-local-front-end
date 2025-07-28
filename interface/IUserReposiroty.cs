using kul_local_back_end.Entities;
using kul_locall_back_end.Entities;
using kul_locall_back_end.models.user;
using Microsoft.AspNetCore.Mvc;

namespace kul_locall_back_end.repository
{
    public interface IUserRepository : IRepository<User>
    {
        Task<bool> isEmailExits(string email);
        Task<IResult> GetUserByEmailAsync(string email);
        Task<User> GetUserByEmail(string email);
        Task<IResult> GetUsersByRoleAsync(UserRole role);
        Task<IResult> GetRole(string email);
        Task<IResult> CreateUserAsync(CreateDTOStudent user, UserRole role);
        Task<IResult> ExportUsersToExcelAsync();
        Task<IResult> ImportUsersFromExcelAsync(IFormFile file);
    }
}
