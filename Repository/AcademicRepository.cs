using kul_local_back_end.Entities;
using kul_local_back_end.Repositories;
using kul_local_back_end.Repository;
using kul_locall_back_end;
using kul_locall_back_end.Entities;
using MongoDB.Driver;

public class AcademicRepository : IAcademicRepository
{
    private readonly AttendanceRepository _attendancesRepository;
    private readonly IMongoCollection<QuizResult> _quizResults;
    private readonly IMongoCollection<NewsResult> _newsResults;
    private readonly IMongoCollection<News> _news;
    private readonly IMongoCollection<AssignmentSubmission> _submission;
    private readonly IMongoCollection<Quiz> _quiz;
    private readonly IMongoCollection<Assignment> _assignments;
    private readonly IMongoCollection<Schedule> _schedules;
    private readonly UsersRepository _users;
    private readonly IMongoCollection<Class> _classes;
    private readonly RegisterRepository _register ;
    public AcademicRepository(IMongoDatabase db, UsersRepository users, AttendanceRepository attendanceRepository, RegisterRepository registerRepository)
    {
        _attendancesRepository = attendanceRepository;
        _quizResults = db.GetCollection<QuizResult>("quizResults");
        _newsResults = db.GetCollection<NewsResult>("news_results");
        _submission = db.GetCollection<AssignmentSubmission>("assignment_submissions");
        _assignments = db.GetCollection<Assignment>("assignments");
        _news = db.GetCollection<News>("news");
        _schedules = db.GetCollection<Schedule>("schedule");
        _quiz = db.GetCollection<Quiz>("quiz");
        _register = registerRepository;
        _classes = db.GetCollection<Class>("class");

        _users = users;
    }

    public async Task<IResult> GetProgressForStudentAsync(string email)
    {
        var user = await _users.GetUserByEmail(email);
        if (user == null)
            return Results.NotFound(new { message = "User not found." });

        var userId = user.Id;

        var filterAttendance = Builders<Attendance>.Filter.Eq(a => a.UserId, userId);

        // Attendance score
        var attendanceList = await _attendancesRepository.GetPopulatedAttendancesAsync(filterAttendance);
        var totalAttendance = attendanceList.Count;
        var presentCount = attendanceList.Count(a => a.Status == AttendanceStatus.Present || a.Status == AttendanceStatus.NotYet);
        var attendanceScore = totalAttendance > 0 ? Math.Round(presentCount * 10.0 / totalAttendance, 2) : 0;

        // Quiz score
        var quizList = await _quizResults.Find(q => q.UserId == userId).ToListAsync();
        var quizScore = quizList.Count > 0 ? Math.Round(quizList.Average(q => q.Score), 2) : 0;

        // News score (chia cho 3 lần số ngày có lịch học)
        var newsList = await _newsResults.Find(n => n.CreatedBy == userId).ToListAsync();
        var scheduleDays = await _schedules
            .Find(s => s.ClassId != null)
            .Project(s => s.Date.Date)
            .ToListAsync();
        var uniqueDays = scheduleDays.Distinct().Count();
        var newsScore = uniqueDays > 0
            ? Math.Round(newsList.Sum(n => n.Score) / (3 * uniqueDays), 2)
            : 0;

        // Assignment score
        var assignList = await _submission.Find(a => a.CreatedBy == userId && a.Score != null).ToListAsync();
        var allAssignments = await _assignments.Find(a => a.CreatedBy == userId).ToListAsync();
        var assignmentScore = allAssignments.Count > 0
            ? Math.Round(assignList.Sum(a => a.Score ?? 0) / allAssignments.Count, 2)
            : 0;

        return Results.Ok(new { data =new AcademicProgressResult
        {
            AttendanceScore = attendanceScore,
            QuizScore = quizScore,
            NewsScore = newsScore,
            AssignmentScore = assignmentScore,
            Attendances = attendanceList
        } });
    }

    public async Task<IResult> GetScoreStatisticsByClassAsync(DateTime start, DateTime end)
    {
        var classList = await _classes.Find(Builders<Class>.Filter.Empty).ToListAsync();

        var results = new List<object>();

        foreach (var c in classList)
        {
            var filter = Builders<User>.Filter.Eq(u => u.ClassId, c.Id);

            var students = await _users.GetByFilterAsync(filter);

            var studentIds = students.Select(u => u.Id).ToList();

            var quizScores = await _quizResults.Find(r =>
                studentIds.Contains(r.UserId) && r.SubmittedAt >= start && r.SubmittedAt <= end)
                .ToListAsync();

            var newsScores = await _newsResults.Find(r =>
                studentIds.Contains(r.CreatedBy) && r.CreatedAt >= start && r.CreatedAt <= end)
                .ToListAsync();

            var assignmentScores = await _submission.Find(r =>
                studentIds.Contains(r.CreatedBy) && r.SubmittedAt >= start && r.SubmittedAt <= end)
                .ToListAsync();

            double avgQuiz = quizScores.Count > 0 ? quizScores.Average(r => r.Score) : 0;
            double avgNews = newsScores.Count > 0 ? newsScores.Average(r => r.Score) : 0;
            double avgAssignment = (double)(assignmentScores.Count > 0 ? assignmentScores.Average(r => r.Score) : 0);

            double finalScore = Math.Round(avgQuiz * 0.25 + avgNews * 0.25 + avgAssignment * 0.3, 2);

            results.Add(new
            {
                classId = c,
                className = c.Name,
                averageQuizScore = Math.Round(avgQuiz, 2),
                averageNewsScore = Math.Round(avgNews, 2),
                averageAssignmentScore = Math.Round(avgAssignment, 2),
                finalScore
            });
        }

        return Results.Ok(new { data =results });
    }

    public async Task<IResult> GetScoreStatisticsByCoachAsync(DateTime start, DateTime end)
    {

        var filterUser = Builders<User>.Filter.Eq(u => u.Role, UserRole.Coach.ToString());

        var coachIds = await _users.GetByFilterAsync(filterUser);

        var results = new List<object>();

        foreach (var coachId in coachIds)
        {
            var schedules = await _schedules.Find(s =>
                s.CoachId == coachId.Id && s.Date >= start && s.Date <= end).ToListAsync();

            var filterNews = Builders<News>.Filter.Eq(n => n.CoachId, coachId.Id);

            var newsList = await _news.Find(filterNews).ToListAsync();

            var newsIds = newsList.Select(n => n.Id).ToList();

            var filterAssignment = Builders<Assignment>.Filter.Eq(a => a.CreatedBy, coachId.Id);

            var assignments = await _assignments.Find(filterAssignment).ToListAsync();

            var assignmentIds = assignments.Select(a => a.Id).ToList();

            var filterQuiz = Builders<Quiz>.Filter.Eq(q => q.CreatedBy, coachId.Id);
            var quizzes = await _quiz.Find(filterQuiz).ToListAsync();

            var quizIds = quizzes.Select(q => q.Id).ToList();


            var studentIds = _users.GetByFilterAsync(
                Builders<User>.Filter.And(
                    Builders<User>.Filter.In(u => u.ClassId, schedules.Select(s => s.ClassId)),
                    Builders<User>.Filter.Eq(u => u.Role, UserRole.Student.ToString())
                )).Result.Select(u => u.Id).ToList();

            if (studentIds.Count == 0) continue;

            var quizScores = await _quizResults.Find(r =>
                quizIds.Contains(r.QuizId) && r.SubmittedAt >= start && r.SubmittedAt <= end)
                .ToListAsync();

            var newsScores = await _newsResults.Find(r =>
                newsIds.Contains(r.NewsId) && r.CreatedAt >= start && r.CreatedAt <= end)
                .ToListAsync();

            var assignmentScores = await _submission.Find(r =>
                assignmentIds.Contains(r.AssignmentId) && r.SubmittedAt >= start && r.SubmittedAt <= end)
                .ToListAsync();

            double avgQuiz = quizScores.Count > 0 ? quizScores.Average(r => r.Score) : 0;
            double avgNews = newsScores.Count > 0 ? newsScores.Average(r => r.Score) : 0;
            double avgAssignment = (double)(assignmentScores.Count > 0 ? assignmentScores.Average(r => r.Score) : 0);

            double finalScore = Math.Round(avgQuiz * 0.25 + avgNews * 0.25 + avgAssignment * 0.3, 2);

            var coach = await _users.GetByIdAsync(coachId.Id);

            results.Add(new
            {
                coachId = coachId,
                coachName = coach?.FirstName + " " + coach?.LastName,
                averageQuizScore = Math.Round(avgQuiz, 2),
                averageNewsScore = Math.Round(avgNews, 2),
                averageAssignmentScore = Math.Round(avgAssignment, 2),
                finalScore
            });
        }

        return Results.Ok(new { data = results });
    }

    public async Task<IResult> GetClassAcademicSummaryAsync(string classId, DateTime from, DateTime to)
    {
        var filterUser = Builders<User>.Filter.Eq(u => u.ClassId, classId);
        var users = await _users.GetByFilterAsync(filterUser);
        var userIds = users.Select(u => u.Id).ToList();

        var quizScores = await _quizResults.Find(q =>
            userIds.Contains(q.UserId) && q.SubmittedAt >= from && q.SubmittedAt <= to)
            .ToListAsync();

        var newsScores = await _newsResults.Find(n =>
            userIds.Contains(n.CreatedBy) && n.CreatedAt >= from && n.CreatedAt <= to)
            .ToListAsync();

        var assignmentScores = await _submission.Find(s =>
            userIds.Contains(s.CreatedBy) && s.SubmittedAt >= from && s.SubmittedAt <= to)
            .ToListAsync();

        var allDates = quizScores.Select(q => q.SubmittedAt.Date)
            .Concat(newsScores.Select(n => n.CreatedAt.Date))
            .Concat(assignmentScores.Select(a => a.SubmittedAt.Date))
            .Distinct()
            .OrderBy(d => d)
            .ToList();

        var dailySummary = await Task.WhenAll(allDates.Select(async date =>
        {
            var user = await _users.GetByIdAsync(users.FirstOrDefault(u => u.ClassId == classId)?.Id ?? string.Empty);

            var dailyQuiz = quizScores.Where(q => q.SubmittedAt.Date == date).Select(q => q.Score).ToList();
            var dailyNews = newsScores.Where(n => n.CreatedAt.Date == date).Select(n => n.Score).ToList();
            var dailyAssign = assignmentScores.Where(a => a.SubmittedAt.Date == date).Select(a => a.Score).ToList();

            double avgQuiz = dailyQuiz.Count > 0 ? dailyQuiz.Average() : 0;
            double avgNews = dailyNews.Count > 0 ? dailyNews.Average() : 0;
            double avgAssign = (double)(dailyAssign.Count > 0 ? dailyAssign.Average() : 0);

            double final = Math.Round(avgQuiz * 0.25 + avgNews * 0.25 + avgAssign * 0.3, 2);

            return new
            {
                date = date.ToString("yyyy-MM-dd"),
                averageQuizScore = Math.Round(avgQuiz, 2),
                averageNewsScore = Math.Round(avgNews, 2),
                averageAssignmentScore = Math.Round(avgAssign, 2),
            };
        }));

        var classInfo = await _classes.Find(Builders<Class>.Filter.Eq(cl => cl.Id, classId)).FirstOrDefaultAsync();

        return Results.Ok(new
        {
            classId = classInfo?.Id,
            className = classInfo?.Name,
            from = from.ToString("yyyy-MM-dd"),
            to = to.ToString("yyyy-MM-dd"),
            dailySummary
        });
    }

    public async Task<IResult> GetCoachAcademicSummaryAsync(string coachId, DateTime from, DateTime to)
    {
        var filterUser = Builders<User>.Filter.Eq(u => u.Id, coachId) & Builders<User>.Filter.Eq(u => u.Role, UserRole.Coach.ToString());
        var coach = (await _users.GetByFilterAsync(filterUser)).FirstOrDefault();

        if (coach == null)
            return Results.NotFound("Coach not found");

        var quizIds = (await _quiz.Find(q => q.CreatedBy == coach.Id).ToListAsync()).Select(q => q.Id).ToList();
        var newsIds = (await _news.Find(n => n.CoachId == coach.Id).ToListAsync()).Select(n => n.Id).ToList();
        var assignmentIds = (await _assignments.Find(a => a.CreatedBy == coach.Id).ToListAsync()).Select(a => a.Id).ToList();

        var quizScores = await _quizResults.Find(r =>
            quizIds.Contains(r.QuizId) && r.SubmittedAt >= from && r.SubmittedAt <= to).ToListAsync();

        var newsScores = await _newsResults.Find(r =>
            newsIds.Contains(r.NewsId) && r.CreatedAt >= from && r.CreatedAt <= to).ToListAsync();

        var assignmentScores = await _submission.Find(r =>
            assignmentIds.Contains(r.AssignmentId) && r.SubmittedAt >= from && r.SubmittedAt <= to).ToListAsync();

        // Gộp tất cả ngày có thể
        var allDates = quizScores.Select(q => q.SubmittedAt.Date)
            .Concat(newsScores.Select(n => n.CreatedAt.Date))
            .Concat(assignmentScores.Select(a => a.SubmittedAt.Date))
            .Distinct()
            .OrderBy(d => d)
            .ToList();

        var dailySummary = allDates.Select(date =>
        {
            var dailyQuiz = quizScores.Where(q => q.SubmittedAt.Date == date).Select(q => q.Score).ToList();
            var dailyNews = newsScores.Where(n => n.CreatedAt.Date == date).Select(n => n.Score).ToList();
            var dailyAssign = assignmentScores.Where(a => a.SubmittedAt.Date == date).Select(a => a.Score).ToList();

            double avgQuiz = dailyQuiz.Count > 0 ? dailyQuiz.Average() : 0;
            double avgNews = dailyNews.Count > 0 ? dailyNews.Average() : 0;
            double avgAssign = (double)(dailyAssign.Count > 0 ? dailyAssign.Average() : 0);

            double final = Math.Round(avgQuiz * 0.25 + avgNews * 0.25 + avgAssign * 0.3, 2);

            return new
            {
                date = date.ToString("yyyy-MM-dd"),
                averageQuizScore = Math.Round(avgQuiz, 2),
                averageNewsScore = Math.Round(avgNews, 2),
                averageAssignmentScore = Math.Round(avgAssign, 2),
            };
        });

        return Results.Ok(new
        {
            coachId = coach,
            coachName = coach.FirstName + " " + coach.LastName,
            from = from.ToString("yyyy-MM-dd"),
            to = to.ToString("yyyy-MM-dd"),
            dailySummary
        });
    }

    public async Task<IResult> GetTedTeamRegisterSummaryAsync(DateTime from, DateTime to)
    {
        var filter = Builders<Register>.Filter.Gte(r => r.CreatedAt, from) &
                     Builders<Register>.Filter.Lte(r => r.CreatedAt, to);

        var registers = await _register.getPopulateStartEndTime(from, to, null);

        var grouped = await Task.WhenAll( registers
            .GroupBy(r => r.AssignId)
            .Select(async g => new
            {
                Email = g.Key,
                tedteam = await _users.GetByIdAsync(g.Key),
                Total = g.Count(),
                Approved = g.Count(x => x.Status == RegisterStatus.Approved),
                Rejected = g.Count(x => x.Status == RegisterStatus.Rejected),
                Pending = g.Count(x => x.Status == RegisterStatus.Pending)
            }));

        return Results.Ok(grouped);
    }

    public async Task<IResult> GetTedTeamRegisterSummaryByTedTeamIdAsync(string tedteamId, DateTime from, DateTime to)
    {
        var user = await _users.GetByIdAsync(tedteamId);
        if (user == null)
            return Results.NotFound(new { message = "User not found." });


        var registers = await _register.getPopulateStartEndTime(from, to, user.Id);

        var summary = registers
            .GroupBy(r => r.Schedule.Date)
            .OrderBy(g => g.Key)
            .Select(g => new
            {
                Date = g.Key.ToString("yyyy-MM-dd"),
                Approved = g.Count(x => x.Status == RegisterStatus.Approved),
                Rejected = g.Count(x => x.Status == RegisterStatus.Rejected),
                Pending = g.Count(x => x.Status == RegisterStatus.Pending)
            });

        return Results.Ok(summary);
    }

}
