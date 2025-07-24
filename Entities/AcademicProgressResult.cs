namespace kul_local_back_end.Entities
{
    public class AcademicProgressResult
    {
        public double AttendanceScore { get; set; }
        public double QuizScore { get; set; }
        public double NewsScore { get; set; }
        public double AssignmentScore { get; set; }
        public double FinalScore => Math.Round(
            AttendanceScore * 0.2 +
            QuizScore * 0.25 +
            NewsScore * 0.25 +
            AssignmentScore * 0.3, 2
        );

        public List<AttendanceResponse> Attendances { get; set; } = new();
    }

}
