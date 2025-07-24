using kul_local_back_end.Entities;
using kul_local_back_end.models.assignment;

public interface IAssignmentSubmissionRepository : IRepository<AssignmentSubmission>
{
    Task<IResult> SubmitAsync(CreateAssignmentSubmissionDTO dto, string studentEmail);
    Task<IResult> UpdateSubmissionAsync(string submissionId, UpdateAssignmentSubmissionDTO dto, string studentEmail);
    Task<IResult> GradeAsync(string submissionId, GradeSubmissionDTO dto);
    Task<IResult> GetStudentSubmissions(string email);
    Task<IResult> GetCoachAssignmentSubmissions(string email, string assignmentId); // lấy tất cả submission của coach phụ trách
    Task<IResult> GetAssignmentSubmissionsByAssignmentId(string assignmentId);
}
