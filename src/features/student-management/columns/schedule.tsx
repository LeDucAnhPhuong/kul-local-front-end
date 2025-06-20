import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ColumnDef, Row } from '@tanstack/react-table';
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
  roomName: string;
  locationAndClass: string;
  coachName: string;
  time: string;
  status: 'not yet' | 'present' | 'absent';
  date: string;
  class_id: string;
  room_id: string;
  coach_id: string;
  TedTeam_id: string | null;
  user_id: string;
  calendar_id: string;
  slot_id: string;
};

// Updated API data structure based on the provided data
export type APIAttendanceData = {
  _id: string;
  status: number; // 0 = not yet, 1 = present, 2 = absent
  userId: string | null;
  created_at: string;
  created_by: any | null;
  isActive: boolean;
  schedule: {
    _id: string;
    classId: string;
    classInfo: {
      _id: string;
      name: string;
      startTime: string;
      endTime: string;
      isActive: boolean;
      created_at: string;
      created_by: any | null;
      updated_at: string;
      updated_by: any | null;
    } | null;
    coach: {
      _id: string;
      email: string;
      first_name: string;
      last_name: string;
      role: string;
      class_id: any | null;
      profile_image: string;
      isActive: boolean;
      created_at: string;
      created_by: any | null;
      updated_at: string;
      updated_by: any | null;
    };
    coachId: string;
    room: {
      _id: string;
      name: string;
      capacity: number;
      location: string;
      description: string;
      isActive: boolean;
      created_at: string;
      created_by: any | null;
      updated_at: string;
      updated_by: any | null;
    };
    roomId: string;
    slot: {
      _id: string;
      name: string;
      startTime: string;
      endTime: string;
      isActive: boolean;
      created_at: string;
      created_by: any | null;
      updated_at: string;
      updated_by: any | null;
    };
    slotId: string;
    date: string;
    note: any | null;
    tedTeamId: any | null;
    isActive: boolean;
    created_at: string;
    created_by: any | null;
    updated_at: string;
    updated_by: any | null;
  };
  scheduleId: any | null;
  updated_at: string;
  updated_by: any | null;
  user?: {
    _id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    role: string;
    class_id: string;
    profile_image: string;
    isActive: boolean;
    created_at: string;
    created_by: any | null;
    updated_at: string;
    updated_by: any | null;
  };
};

// Define all possible slots (1-5)
const ALL_SLOTS = ['Slot 1', 'Slot 2', 'Slot 3', 'Slot 4', 'Slot 5'];

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
          {/* Class Name - Dòng đầu tiên */}
          <p className="text-xs font-semibold leading-tight md:text-sm line-clamp-2">
            {cell.roomName}
          </p>
          
          {/* Room Location | Room Name - Dòng thứ hai */}
          <p className="text-xs leading-tight text-muted-foreground">
            {cell.locationAndClass}
          </p>
          
          {/* Coach Name - Dòng thứ ba */}
          <p className="text-xs leading-tight text-gray-600">
            {cell.coachName}
          </p>

          {/* Status Badge - Dòng thứ tư */}
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

// Helper function to format time from startTime and endTime
function formatTimeRange(startTime: string, endTime: string): string {
  return `${startTime}-${endTime}`;
}

// Helper function to determine status based on API status code
function getAttendanceStatus(status: number): 'not yet' | 'present' | 'absent' {
  switch (status) {
    case 0:
      return 'not yet';
    case 1:
      return 'present';
    case 2:
      return 'absent';
    default:
      return 'not yet';
  }
}

// Main function to transform new API attendance data to SlotSchedule format
export function transformAttendanceData(attendanceData: APIAttendanceData[]): SlotSchedule[] {
  // Initialize all slots first
  const slotGroups: Record<string, Partial<SlotSchedule>> = {};
  
  // Create all slots (1-5) even if they're empty
  ALL_SLOTS.forEach(slotName => {
    slotGroups[slotName] = { slot: slotName };
  });

  // Process each attendance record
  attendanceData.forEach((attendance) => {
    const { schedule, status } = attendance;
    
    const slotName = schedule.slot.name;
    const dayKey = getDayKeyFromDate(schedule.date);

    if (!dayKey) return; // Skip if day key cannot be determined

    // Initialize slot group if it doesn't exist (for slots not in ALL_SLOTS)
    if (!slotGroups[slotName]) {
      slotGroups[slotName] = { slot: slotName };
    }

    const scheduleCell: ScheduleCell = {
      roomName: schedule.classInfo ? schedule.classInfo.name : '', // Dòng đầu tiên: Class name
      locationAndClass: `${schedule.room.location} | ${schedule.room.name}`, // Dòng thứ hai: Room location | Room name
      coachName: `${schedule.coach.first_name} ${schedule.coach.last_name}`, // Dòng thứ ba: Coach name
      time: formatTimeRange(schedule.slot.startTime, schedule.slot.endTime),
      status: getAttendanceStatus(status),
      date: formatDate(schedule.date),
      class_id: schedule.classId,
      room_id: schedule.roomId,
      coach_id: schedule.coachId,
      TedTeam_id: schedule.tedTeamId,
      user_id: attendance.userId || '',
      calendar_id: schedule._id,
      slot_id: schedule.slotId
    };

    // Assign to the appropriate day
    (slotGroups[slotName] as any)[dayKey] = scheduleCell;
  });

  // Convert to array format and sort by slot name (ensure Slot 1, Slot 2, etc. order)
  return Object.values(slotGroups)
    .sort((a, b) => {
      const aSlot = a.slot || '';
      const bSlot = b.slot || '';
      
      // Extract slot numbers for proper sorting
      const aMatch = aSlot.match(/Slot (\d+)/);
      const bMatch = bSlot.match(/Slot (\d+)/);
      
      if (aMatch && bMatch) {
        return parseInt(aMatch[1]) - parseInt(bMatch[1]);
      }
      
      return aSlot.localeCompare(bSlot);
    }) as SlotSchedule[];
}

// Function to get attendance status for a specific user and schedule
export function getUserAttendanceStatus(userId: string, scheduleId: string, attendanceData: APIAttendanceData[]): 'not yet' | 'present' | 'absent' {
  const attendance = attendanceData.find(
    item => item.userId === userId && item.schedule._id === scheduleId
  );
  return attendance ? getAttendanceStatus(attendance.status) : 'not yet';
}

// Function to get all attendance records for a specific user
export function getUserAttendanceRecords(userId: string, attendanceData: APIAttendanceData[]): APIAttendanceData[] {
  return attendanceData.filter(item => item.userId === userId);
}

// Function to get attendance summary for a class
export function getClassAttendanceSummary(classId: string, attendanceData: APIAttendanceData[]) {
  const classAttendance = attendanceData.filter(
    item => item.schedule.classId === classId
  );

  const summary = {
    total: classAttendance.length,
    present: classAttendance.filter(item => getAttendanceStatus(item.status) === 'present').length,
    absent: classAttendance.filter(item => getAttendanceStatus(item.status) === 'absent').length,
    notYet: classAttendance.filter(item => getAttendanceStatus(item.status) === 'not yet').length
  };

  return {
    ...summary,
    attendanceRate: summary.total > 0 ? (summary.present / (summary.present + summary.absent)) * 100 : 0
  };
}

// Function to get attendance summary for a specific room
export function getRoomAttendanceSummary(roomId: string, attendanceData: APIAttendanceData[]) {
  const roomAttendance = attendanceData.filter(
    item => item.schedule.roomId === roomId
  );

  const summary = {
    total: roomAttendance.length,
    present: roomAttendance.filter(item => getAttendanceStatus(item.status) === 'present').length,
    absent: roomAttendance.filter(item => getAttendanceStatus(item.status) === 'absent').length,
    notYet: roomAttendance.filter(item => getAttendanceStatus(item.status) === 'not yet').length
  };

  return {
    ...summary,
    attendanceRate: summary.total > 0 ? (summary.present / (summary.present + summary.absent)) * 100 : 0
  };
}

// Function to get attendance summary for a specific coach
export function getCoachAttendanceSummary(coachId: string, attendanceData: APIAttendanceData[]) {
  const coachAttendance = attendanceData.filter(
    item => item.schedule.coachId === coachId
  );

  const summary = {
    total: coachAttendance.length,
    present: coachAttendance.filter(item => getAttendanceStatus(item.status) === 'present').length,
    absent: coachAttendance.filter(item => getAttendanceStatus(item.status) === 'absent').length,
    notYet: coachAttendance.filter(item => getAttendanceStatus(item.status) === 'not yet').length
  };

  return {
    ...summary,
    attendanceRate: summary.total > 0 ? (summary.present / (summary.present + summary.absent)) * 100 : 0
  };
}