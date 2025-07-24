namespace kul_local_back_end.models.assignment
{
    public class CreateAssignmentSubmissionDTO
    {
        public string AssignmentId { get; set; }
        public string Content { get; set; }
    }

    public class UpdateAssignmentSubmissionDTO
    {
        public string Content { get; set; }
    }

    public class GradeSubmissionDTO
    {
        public double Score { get; set; }
        public string Feedback { get; set; }
    }

}
