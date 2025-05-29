import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { attendanceDummyData, type AttendanceData } from '../slotInfo';
import { CalendarDays, Hourglass } from 'lucide-react';

export type DayKey = 't2' | 't3' | 't4' | 't5' | 't6' | 't7' | 'cn';

export type SlotSchedule = {
  slot: string;
  t2?: ScheduleCell;
  t3?: ScheduleCell;
  t4?: ScheduleCell;
  t5?: ScheduleCell;
  t6?: ScheduleCell;
  t7?: ScheduleCell;
  cn?: ScheduleCell;
};

type ScheduleCell = {
  topic: string;
  instructor: string;
  location: string;
  time: string;
  status: 'not yet' | 'present' | 'absent';
  date: string;
  class_id: number;
  room_id: number;
  coach_id: number;
  TedTeam_id: number;
  user_id: number;
  calendar_id: number;
};

export const columns: ColumnDef<SlotSchedule>[] = [
  {
    accessorKey: 'slot',
    header: 'Slot',
    cell: ({ row }) => (
      <div className="text-sm font-medium md:text-base whitespace-nowrap">
        {row.getValue('slot')}
      </div>
    ),
  },
  ...['t2', 't3', 't4', 't5', 't6', 't7', 'cn'].map((dayKey) => ({
    accessorKey: dayKey,
    header: (() => {
      const dayHeaderMap: Record<string, string> = {
        't2': 'MON',
        't3': 'TUE', 
        't4': 'WED',
        't5': 'THU',
        't6': 'FRI',
        't7': 'SAT',
        'cn': 'SUN'
      };
      return dayHeaderMap[dayKey] || dayKey.toUpperCase();
    })(),
    cell: ({ row }: { row: Row<SlotSchedule> }) => {
      const cell: ScheduleCell | undefined = row.getValue(dayKey);
      if (!cell) {
        return (
          <div className="flex items-center justify-center py-2 text-lg text-red-500 md:text-2xl">
            -
          </div>
        );
      }

      return (
        <div className="space-y-1 p-1 min-w-[120px] max-w-[160px]">
          {/* Topic and Instructor */}
          <div className="space-y-1">
            <p className="text-xs font-semibold leading-tight md:text-sm line-clamp-2">
              {cell.topic}
            </p>
            <p className="text-xs leading-tight text-muted-foreground">
              Coach ID: {cell.coach_id}
            </p>
          </div>

          {/* Room and Class Info */}
          <div className="text-xs leading-tight text-gray-600">
            Room {cell.room_id} | Class {cell.class_id}
          </div>

          {/* Status Badge */}
          <Badge
            className={cn(
              'text-xs px-2 py-1 w-fit',
              cell.status === 'not yet'
                ? 'bg-orange-500 hover:bg-orange-600'
                : cell.status === 'absent'
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-green-500 hover:bg-green-600'
            )}
          >
            {cell.status === 'not yet' 
              ? 'Not Yet' 
              : cell.status === 'absent' 
              ? 'Absent' 
              : 'Present'}
          </Badge>
{/* Time */}
<div className="flex items-center gap-1 text-xs font-medium leading-tight text-green-600">
  <Hourglass className="inline-block size-3" />
  {cell.time}
</div>

{/* Date */}
<div className="flex items-center gap-1 text-xs font-medium leading-tight text-blue-600">
  <CalendarDays className="inline-block size-3" />
  {cell.date}
</div>
        </div>
      );
    },
    meta: {
      sort: false,
      filter: false,
    },
  })),
];

// Helper function to get day key from date string
function getDayKeyFromDate(dateString: string): DayKey | null {
  const date = new Date(dateString);
  const dayOfWeek = date.getDay();
  
  const dayKeyMap: Record<number, DayKey> = {
    0: 'cn',  // Sunday
    1: 't2',  // Monday
    2: 't3',  // Tuesday
    3: 't4',  // Wednesday
    4: 't5',  // Thursday
    5: 't6',  // Friday
    6: 't7'   // Saturday
  };
  
  return dayKeyMap[dayOfWeek] || null;
}

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit'
  });
}

// Helper function to generate slot name from slot_id
function getSlotName(slotId: number): string {
  const slotNames: Record<number, string> = {
    1: 'Slot 1',
    2: 'Slot 2',
    3: 'Slot 3',
    4: 'Slot 4',
    5: 'Slot 5'
  };
  return slotNames[slotId] || `Slot ${slotId}`;
}

// Helper function to get time range from slot_id
function getTimeRange(slotId: number): string {
  const timeRanges: Record<number, string> = {
    1: '07:30-09:30',
    2: '09:45-11:45',
    3: '12:00-14:00', 
    4: '14:15-16:15',
    5: '16:30-18:30'
  };
  return timeRanges[slotId] || 'TBD';
}

// Main function to transform attendance data to SlotSchedule format
export function transformAttendanceData(attendanceData: AttendanceData[] = attendanceDummyData): SlotSchedule[] {
  const slotGroups: Record<string, Partial<SlotSchedule>> = {};

  // Process each attendance record
  attendanceData.forEach((attendance) => {
    const { classCalendar, status, user_id } = attendance;
    const { classes, slot_id, date, room_id, coach_id, TedTeam_id, _id: calendar_id } = classCalendar;
    
    const slotName = getSlotName(slot_id);
    const dayKey = getDayKeyFromDate(date);

    if (!dayKey) return; // Skip if day key cannot be determined

    // Initialize slot group if it doesn't exist
    if (!slotGroups[slotName]) {
      slotGroups[slotName] = { slot: slotName };
    }

    const scheduleCell: ScheduleCell = {
      topic: classes.name,
      instructor: `Coach ${coach_id}`, 
      location: `Room ${room_id}`,
      time: getTimeRange(slot_id),
      status: status, 
      date: formatDate(date),
      class_id: classes._id,
      room_id: room_id,
      coach_id: coach_id,
      TedTeam_id: TedTeam_id,
      user_id: user_id,
      calendar_id: calendar_id
    };

    // Assign to the appropriate day
    (slotGroups[slotName] as any)[dayKey] = scheduleCell;
  });

  // Convert to array format
  return Object.values(slotGroups) as SlotSchedule[];
}

// Function to get attendance status for a specific user and calendar
export function getUserAttendanceStatus(userId: number, calendarId: number): 'not yet' | 'present' | 'absent' {
  const attendance = attendanceDummyData.find(
    item => item.user_id === userId && item.calendar_id === calendarId
  );
  return attendance?.status || 'not yet';
}

// Function to get all attendance records for a specific user
export function getUserAttendanceRecords(userId: number): AttendanceData[] {
  return attendanceDummyData.filter(item => item.user_id === userId);
}

// Function to get attendance summary for a class
export function getClassAttendanceSummary(classId: number) {
  const classAttendance = attendanceDummyData.filter(
    item => item.classCalendar.class_id === classId
  );

  const summary = {
    total: classAttendance.length,
    present: classAttendance.filter(item => item.status === 'present').length,
    absent: classAttendance.filter(item => item.status === 'absent').length,
    notYet: classAttendance.filter(item => item.status === 'not yet').length
  };

  return {
    ...summary,
    attendanceRate: summary.total > 0 ? (summary.present / (summary.present + summary.absent)) * 100 : 0
  };
}

// Additional CSS that should be added to your global styles for line-clamp support
/* Add this to your global CSS file:
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
*/