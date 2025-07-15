using kul_local_back_end.Entities;
using kul_local_back_end.utils;
using kul_locall_back_end.models.common;
using kul_locall_back_end.models.user;
using kul_locall_back_end.repository;
using MongoDB.Driver;

namespace kul_local_back_end.Repository
{
    public class UsersRepository : BaseRepository<User>, IUserRepository
    {
        public UsersRepository(IMongoDatabase database, string collection) : base(database, collection)
        {
        }

        public async Task<List<User>> GetMemberClass(string classId)
        {
            var filter = Builders<User>.Filter.Eq(user => user.ClassId, classId);
            var users = (await GetByFilterAsync(filter));

            return users;
        }

        public async Task<IResult> GetUserByEmailAsync(string email)
        {
            var filter = Builders<User>.Filter.Eq(user => user.Email, email);
            var result = await GetByConditionAsync(filter);
            return Results.Ok(new { data = result.FirstOrDefault(), message = "User retrieved successfully" });
        }

        public async Task<User> GetUserByEmail(string email)
        {
            var filter = Builders<User>.Filter.Eq(user => user.Email, email);
            var result = await GetByConditionAsync(filter);
            return result.FirstOrDefault();
        }

        public async Task<IResult> GetUsersByRoleAsync(UserRole role)
        {

            var filter = Builders<User>.Filter.Eq(user => user.Role, role.ToString());
            var users = await GetByFilterAsync(filter);
            return Results.Ok(new { data = users, message = "Users with specified role retrieved successfully" });
        }

        public async Task<IResult> CreateUserAsync(CreateDTOStudent userDTO, UserRole role)
        {
            var existingUser = await GetUserByEmail(userDTO.email);
            if (existingUser != null)
            {
                return Results.BadRequest(new { message = "User with this email already exists." });
            }

            var user = new User
            {
                Email = userDTO.email,
                Role = role.ToString(), 
            };


            var newUser = await CreateAsync(user);
            return Results.Ok(new { data = newUser, message = "User created successfully" });
        }

        public async Task UpdateUserAsync(string id, User user)
        {
            var existingUser = await GetByIdAsync(id);
            if (existingUser == null)
            {
                throw new KeyNotFoundException("User not found");
            }
            // Update the existing user with the new values

            await UpdateAsync(id, u =>
            {
                u.FirstName = user.FirstName ?? u.FirstName;
                u.LastName = user.LastName ?? u.LastName;
                u.Email = user.Email ?? u.Email;
            });
        }

        public async Task<IResult> DeleteUserAsync(string id)
        {
            var existingUser = await GetByIdAsync(id);
            if (existingUser == null)
            {
                return Results.NotFound(new { message = "User not found" });
            }

            var deletedUser = await DeleteAsync(id);
            return Results.Ok(new { data = deletedUser, message = "User deleted successfully" });
        }

        public async Task<bool> isEmailExits(string email)
        {
            var filter = Builders<User>.Filter.Eq(user => user.Email, email);
            var existingUser = await GetByConditionAsync(filter);
            return existingUser.Any();
        }

        public async Task<IResult> GetRole(string email)
        {
            User user = await GetUserByEmail(email);
            if (user == null)
            {
                return Results.NotFound(new { message = "User not found" });
            }
            return Results.Ok(new { data = user.Role, message = "User role retrieved successfully" });
        }

      
    }
}
    