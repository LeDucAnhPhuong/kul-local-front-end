public interface IAcademicRepository
{
    Task<IResult> GetProgressForStudentAsync(string email);
    Task<IResult> GetScoreStatisticsByClassAsync(DateTime start, DateTime end);
    Task<IResult> GetScoreStatisticsByCoachAsync(DateTime start, DateTime end);
    Task<IResult> GetClassAcademicSummaryAsync(string classId, DateTime from, DateTime to);
    Task<IResult> GetCoachAcademicSummaryAsync(string coachId, DateTime from, DateTime to);
    Task<IResult> GetTedTeamRegisterSummaryAsync(DateTime from, DateTime to);
    Task<IResult> GetTedTeamRegisterSummaryByTedTeamIdAsync(string tedteamId, DateTime from, DateTime to);
    Task<IResult> GetCoachQuizStatisticsAsync(string email);
    Task<IResult> GetQuizResultsByCoachAsync(string email, string classId);
    Task<IResult> GetQuizResultsByQuizId(string email, string quizId);

}
