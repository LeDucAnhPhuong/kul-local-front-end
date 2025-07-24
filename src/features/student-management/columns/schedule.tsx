import { Badge } from '@/components/ui/badge';
import type { ScheduleCell } from '@/features/tedteam/slotInfo';
import { cn } from '@/lib/utils';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { formatDate } from 'date-fns';
import { BookOpen, CalendarDays, Hourglass, MapPin } from 'lucide-react';

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

export type APIAttendanceData = {
  id: string;
  status: number;
  userId: string | null;
  createdAt: string;
  createdBy: any | null;
  isActive: boolean;
  schedule: {
    id: string;
    classId: string;
    classInfor: {
      id: string;
      name: string;
      startTime: string;
      endTime: string;
      isActive: boolean;
      createdAt: string;
      createdBy: any | null;
      updatedAt: string;
      updatedBy: any | null;
    } | null;
    coach: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      classId: any | null;
      profileImage: string;
      isActive: boolean;
      createdAt: string;
      createdBy: any | null;
      updatedAt: string;
      updatedBy: any | null;
    };
    coachId: string;
    room: {
      id: string;
      name: string;
      capacity: number;
      location: string;
      description: string;
      isActive: boolean;
      createdAt: string;
      createdBy: any | null;
      updatedAt: string;
      updatedBy: any | null;
    };
    roomId: string;
    slot: {
      id: string;
      name: string;
      startTime: string;
      endTime: string;
      isActive: boolean;
      createdAt: string;
      createdBy: any | null;
      updatedAt: string;
      updatedBy: any | null;
    };
    slotId: string;
    date: string;
    note: any | null;
    tedTeamId: any | null;
    isActive: boolean;
    createdAt: string;
    createdBy: any | null;
    updatedAt: string;
    updatedBy: any | null;
  };
  scheduleId: any | null;
  updatedAt: string;
  updatedBy: any | null;
  user?: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: string;
    classId: string;
    profileImage: string;
    isActive: boolean;
    createdAt: string;
    createdBy: any | null;
    updatedAt: string;
    updatedBy: any | null;
  };
};

const dayHeaders: { [key in DayKey]: string } = {
  t2: 'MON',
  t3: 'TUE',
  t4: 'WED',
  t5: 'THUR',
  t6: 'FRI',
  t7: 'SAT',
  cn: 'SUN',
};

export const columns: ColumnDef<SlotSchedule>[] = [
  {
    accessorKey: 'slot',
    header: 'SLOT',
    cell: ({ row }) => (
      <div className="text-base font-semibold text-gray-800 whitespace-nowrap py-2 px-4">
        {row.getValue('slot')}
      </div>
    ),
  },
  ...(['t2', 't3', 't4', 't5', 't6', 't7', 'cn'] as DayKey[]).map((dayKey) => ({
    accessorKey: dayKey,
    header: dayHeaders[dayKey],
    cell: ({ row }: { row: Row<SlotSchedule> }) => {
      const cell: ScheduleCell | undefined = row.getValue(dayKey);
      if (!cell) {
        return (
          <div className="flex items-center justify-center h-full py-2">
            <span className="text-xl font-medium text-gray-400"> - </span>
          </div>
        );
      }

      return (
        <div className="max-w-[190px]">
          <div className="space-y-2 transition-shadow duration-200">
            {/* Room Name & Status Badge */}
            <div className="flex justify-between items-start mb-1">
              <p className="text-sm font-bold leading-tight text-gray-900 line-clamp-2">
                {cell.roomId}
              </p>
              <Badge
                className={cn(
                  'text-xs px-2 py-0.5 w-fit font-semibold', // Made badge slightly smaller
                  cell.status === 'not yet'
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : cell.status === 'absent'
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white',
                )}
              >
                {cell.status === 'not yet'
                  ? 'Not Yet'
                  : cell.status === 'absent'
                  ? 'Absent'
                  : 'Present'}
              </Badge>
            </div>

            {/* Location and Class */}
            <div className="flex gap-2 space-y-0.5">
              <div className="flex items-center gap-1 text-xs text-gray-700">
                <MapPin className="size-3.5 text-gray-500" />
                <span className="leading-tight">{cell.location}</span>
              </div>
              {cell.classId && ( // Only render class if it's available after splitting
                <div className="flex items-center gap-1 text-xs text-gray-700">
                  <BookOpen className="size-3.5 text-gray-500" />
                  <span className="leading-tight">{cell.classId}</span>
                </div>
              )}
            </div>

            {/* Coach Name */}
            <div className="flex items-center gap-1 text-xs text-gray-700 mt-1">
              <span className="leading-tight">{cell.coachId}</span>
            </div>

            {/* Time and Date */}
            <div className="flex gap-2 space-y-0.5 mt-2 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-1 text-xs font-medium leading-tight text-gray-600">
                <CalendarDays className="size-3.5 text-gray-500" />
                {formatDate(cell.date, 'dd/MM/yyyy')}
              </div>
              <div className="flex items-center gap-1 text-xs font-medium leading-tight text-gray-600">
                <Hourglass className="size-3.5 text-gray-500" />
                {cell.time}
              </div>
            </div>
          </div>
        </div>
      );
    },
  })),
];
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

export function getUserAttendanceStatus(
  userId: string,
  scheduleId: string,
  attendanceData: APIAttendanceData[],
): 'not yet' | 'present' | 'absent' {
  const attendance = attendanceData.find(
    (item) => item.userId === userId && item.schedule.id === scheduleId,
  );
  return attendance ? getAttendanceStatus(attendance.status) : 'not yet';
}

export function getUserAttendanceRecords(
  userId: string,
  attendanceData: APIAttendanceData[],
): APIAttendanceData[] {
  return attendanceData.filter((item) => item.userId === userId);
}

export function getClassAttendanceSummary(classId: string, attendanceData: APIAttendanceData[]) {
  const classAttendance = attendanceData.filter((item) => item.schedule.classId === classId);
  const summary = {
    total: classAttendance.length,
    present: classAttendance.filter((item) => getAttendanceStatus(item.status) === 'present')
      .length,
    absent: classAttendance.filter((item) => getAttendanceStatus(item.status) === 'absent').length,
    notYet: classAttendance.filter((item) => getAttendanceStatus(item.status) === 'not yet').length,
  };
  return {
    ...summary,
    attendanceRate:
      summary.total > 0 ? (summary.present / (summary.present + summary.absent)) * 100 : 0,
  };
}

export function getRoomAttendanceSummary(roomId: string, attendanceData: APIAttendanceData[]) {
  const roomAttendance = attendanceData.filter((item) => item.schedule.roomId === roomId);
  const summary = {
    total: roomAttendance.length,
    present: roomAttendance.filter((item) => getAttendanceStatus(item.status) === 'present').length,
    absent: roomAttendance.filter((item) => getAttendanceStatus(item.status) === 'absent').length,
    notYet: roomAttendance.filter((item) => getAttendanceStatus(item.status) === 'not yet').length,
  };
  return {
    ...summary,
    attendanceRate:
      summary.total > 0 ? (summary.present / (summary.present + summary.absent)) * 100 : 0,
  };
}

export function getCoachAttendanceSummary(coachId: string, attendanceData: APIAttendanceData[]) {
  const coachAttendance = attendanceData.filter((item) => item.schedule.coachId === coachId);
  const summary = {
    total: coachAttendance.length,
    present: coachAttendance.filter((item) => getAttendanceStatus(item.status) === 'present')
      .length,
    absent: coachAttendance.filter((item) => getAttendanceStatus(item.status) === 'absent').length,
    notYet: coachAttendance.filter((item) => getAttendanceStatus(item.status) === 'not yet').length,
  };
  return {
    ...summary,
    attendanceRate:
      summary.total > 0 ? (summary.present / (summary.present + summary.absent)) * 100 : 0,
  };
}
