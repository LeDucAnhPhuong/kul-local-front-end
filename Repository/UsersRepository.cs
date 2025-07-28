using ClosedXML.Excel;
using kul_local_back_end.Entities;
using kul_local_back_end.Repositories;
using kul_local_back_end.utils;
using kul_locall_back_end.models.common;
using kul_locall_back_end.models.user;
using kul_locall_back_end.repository;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Text.Json;
using System.Text.Json.Serialization;

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

        public async Task<IResult> ImportUsersFromExcelAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return Results.BadRequest(new { message = "File is empty or not provided." });

            var validRoles = Enum.GetValues(typeof(UserRole))
                                 .Cast<UserRole>()
                                 .Select(r => r.ToString())
                                 .ToHashSet(StringComparer.OrdinalIgnoreCase);

            var users = new List<User>();
            var invalidRoles = new List<string>();
            var duplicateEmails = new List<string>();
            var incomingEmails = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            var skippedEmailsInExcel = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            using var stream = new MemoryStream();
            await file.CopyToAsync(stream);
            stream.Position = 0;

            using var workbook = new XLWorkbook(stream);
            var worksheet = workbook.Worksheets.First();
            var rows = worksheet.RowsUsed().Skip(1);

            foreach (var row in rows)
            {
                var email = row.Cell(1).GetValue<string>().Trim();
                if (string.IsNullOrWhiteSpace(email)) continue;

                var firstName = row.Cell(2).GetValue<string>().Trim();
                var lastName = row.Cell(3).GetValue<string>().Trim();
                var role = row.Cell(4).GetValue<string>().Trim();

                // Role không hợp lệ
                if (!validRoles.Contains(role))
                {
                    invalidRoles.Add($"{email} → Invalid role: {role}");
                    continue;
                }

                // Email bị trùng trong file Excel
                if (!incomingEmails.Add(email))
                {
                    skippedEmailsInExcel.Add(email);
                    continue;
                }

                users.Add(new User
                {
                    Email = email,
                    FirstName = firstName,
                    LastName = lastName,
                    Role = role
                });
            }

            // Check email đã tồn tại trong database
            var existingEmailsFilter = Builders<User>.Filter.In(u => u.Email, incomingEmails);
            var existingUsers = await _collection.Find(existingEmailsFilter).ToListAsync();
            var existingEmails = existingUsers.Select(u => u.Email).ToHashSet(StringComparer.OrdinalIgnoreCase);

            // Chỉ insert các user không bị trùng email trong DB
            var usersToInsert = users.Where(u => !existingEmails.Contains(u.Email)).ToList();
            duplicateEmails.AddRange(existingEmails);

            if (usersToInsert.Any())
            {
                await _collection.InsertManyAsync(usersToInsert);
            }

            return Results.Ok(new
            {
                message = $"Imported {usersToInsert.Count} users successfully.",
                skipped = new
                {
                    invalidRoles,
                    duplicateEmails = duplicateEmails.Distinct().ToList(),
                    duplicateInFile = skippedEmailsInExcel.Distinct().ToList()
                }
            });
        }
        public async Task<IResult> ExportUsersToExcelAsync()
        {
            var users = await _collection.Find(Builders<User>.Filter.Empty).ToListAsync();

            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Users");

            worksheet.Cell(1, 1).Value = "Email";
            worksheet.Cell(1, 2).Value = "FirstName";
            worksheet.Cell(1, 3).Value = "LastName";
            worksheet.Cell(1, 4).Value = "Role";

            for (int i = 0; i < users.Count; i++)
            {
                worksheet.Cell(i + 2, 1).Value = users[i].Email;
                worksheet.Cell(i + 2, 2).Value = users[i].FirstName;
                worksheet.Cell(i + 2, 3).Value = users[i].LastName;
                worksheet.Cell(i + 2, 4).Value = users[i].Role;
            }

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            stream.Position = 0;

            return Results.File(
                fileContents: stream.ToArray(),
                contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                fileDownloadName: $"Users_{DateTime.Now:yyyyMMddHHmmss}.xlsx"
            );
        }

   
    }
}
    