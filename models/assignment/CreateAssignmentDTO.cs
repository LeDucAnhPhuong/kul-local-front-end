using kul_local_back_end.Entities;

namespace kul_local_back_end.models.assignment
{
    public class CreateAssignmentDTO
    {
        public string Title { get; set; }
        public AssignmentType Type { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime DueTime { get; set; }
        public string Content { get; set; }
        public string ClassId { get; set; } 
    }

    public class UpdateAssignmentDTO : CreateAssignmentDTO { }

}
