using kul_local_back_end.Entities;
using kul_locall_back_end.Entities;
using Microsoft.Extensions.Hosting;
using MongoDB.Driver;

public class AttendanceAutoAbsentService : BackgroundService
{
    private readonly ILogger<AttendanceAutoAbsentService> _logger;
    private readonly IMongoCollection<Attendance> _attendanceCollection;
    private readonly IMongoCollection<Schedule> _scheduleCollection;
    private readonly IMongoCollection<Slot> _slotCollection;

    public AttendanceAutoAbsentService(
        ILogger<AttendanceAutoAbsentService> logger,
        IMongoDatabase db)
    {
        _logger = logger;
        _attendanceCollection = db.GetCollection<Attendance>("attendance");
        _scheduleCollection = db.GetCollection<Schedule>("schedule");
        _slotCollection = db.GetCollection<Slot>("slots");
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                _logger.LogInformation("Checking for expired attendance...");
                await AutoUpdateAbsentAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating attendance status.");
            }

            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
        }
    }

    private async Task AutoUpdateAbsentAsync()
    {
        var now = DateTime.UtcNow;

        var filter = Builders<Attendance>.Filter.Eq(a => a.Status, AttendanceStatus.NotYet);
        var notYetAttendances = await _attendanceCollection.Find(filter).ToListAsync();

        foreach (var att in notYetAttendances)
        {
            var schedule = await _scheduleCollection.Find(s => s.Id == att.ScheduleId).FirstOrDefaultAsync();
            if (schedule == null) continue;

            var slot = await _slotCollection.Find(s => s.Id == schedule.SlotId).FirstOrDefaultAsync();
            if (slot == null) continue;

            if (!TimeSpan.TryParse(slot.EndTime, out var endTime)) continue;

            var endDateTime = schedule.Date.Date.Add(endTime);
            if (endDateTime < now)
            {
                var update = Builders<Attendance>.Update
                    .Set(a => a.Status, AttendanceStatus.Absent)
                    .Set(a => a.UpdatedAt, DateTime.UtcNow);

                await _attendanceCollection.UpdateOneAsync(
                    Builders<Attendance>.Filter.Eq(a => a.Id, att.Id),
                    update
                );

                _logger.LogInformation("Marked absent for user {UserId} in schedule {ScheduleId}", att.UserId, att.ScheduleId);
            }
        }
    }
}
