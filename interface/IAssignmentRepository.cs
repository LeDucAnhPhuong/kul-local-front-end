using kul_local_back_end.Entities;
using kul_local_back_end.models.assignment;

public interface IAssignmentRepository : IRepository<Assignment>
{
    Task<IResult> CreateAsync(CreateAssignmentDTO dto, string? userId);
    Task<IResult> UpdateAsync(string id, UpdateAssignmentDTO dto, string? userId);
    Task<IResult> GetAllAsync();
    Task<IResult> GetByAssignmentIdAsync(string id);
    Task<IResult> DeleteAsync(string id);
    Task<IResult> GetForCoachAsync(string email);
    Task<IResult> GetForStudent(string email);
}
