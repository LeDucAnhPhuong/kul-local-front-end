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

export function transformAttendanceData(apiData: APIAttendanceData[]): SlotSchedule[] {
  const slotGroups: { [slotName: string]: { [dayKey: string]: ScheduleCell } } = {};
  for (let i = 1; i <= 5; i++) slotGroups[`Slot ${i}`] = {};

  apiData.forEach((item) => {
    try {
      const slotName = item.schedule?.slot?.name || 'Unknown Slot';
      const dayKey = getDayKey(item.schedule.date);
      if (slotGroups[slotName] !== undefined) {
        const scheduleCell: ScheduleCell = {
          roomName: item.schedule?.classInfor?.name || 'No Class',
          locationAndClass: `${item.schedule?.room?.location || 'No Location'} | ${
            item.schedule?.room?.name || 'No Room'
          }`,
          coachName:
            `${item.schedule?.coach?.firstName || ''} ${
              item.schedule?.coach?.lastName || ''
            }`.trim() || 'No Coach',
          time: `${item.schedule?.slot?.startTime || ''} - ${item.schedule?.slot?.endTime || ''}`,
          status: getAttendanceStatus(item.status),
          date: formatDateDisplay(item.schedule.date),
          class_id: item.schedule?.classId || '',
          room_id: item.schedule?.roomId || '',
          coach_id: item.schedule?.coachId || '',
          TedTeam_id: item.schedule?.tedTeamId || null,
          user_id: item.userId || '',
          calendar_id: item.id,
          slot_id: item.schedule?.slotId || '',
        };
        slotGroups[slotName][dayKey] = scheduleCell;
      }
    } catch (error) {
      console.error('Error processing item:', item, error);
    }
  });

  return Object.entries(slotGroups)
    .map(([slot, days]) => ({ slot, ...days }))
    .sort((a, b) => getSlotNumber(a.slot) - getSlotNumber(b.slot));
}

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
      <div className="text-sm font-medium md:text-base whitespace-nowrap">
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
          <div className="flex items-start pt-2 justify-left">
            <span className="text-lg font-medium text-red-500 md:text-2xl">  -</span>
          </div>
        );
      }
      return (
        <div className="space-y-1 p-1 min-w-[120px] max-w-[160px]">
          <p className="text-xs font-semibold leading-tight md:text-sm line-clamp-2">
            {cell.roomName}
          </p>
          <p className="text-xs leading-tight text-muted-foreground">{cell.locationAndClass}</p>
          <p className="text-xs leading-tight text-gray-600">{cell.coachName}</p>
          <Badge
            className={cn(
              'text-xs px-2 py-1 w-fit',
              cell.status === 'not yet'
                ? 'bg-orange-500 hover:bg-orange-600'
                : cell.status === 'absent'
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-green-500 hover:bg-green-600',
            )}
          >
            {cell.status === 'not yet'
              ? 'Not Yet'
              : cell.status === 'absent'
              ? 'Absent'
              : 'Present'}
          </Badge>
          <div className="flex items-center gap-1 text-xs font-medium leading-tight text-green-600">
            <Hourglass className="inline-block size-3" />
            {cell.time}
          </div>
          <div className="flex items-center gap-1 text-xs font-medium leading-tight text-blue-600">
            <CalendarDays className="inline-block size-3" />
            {cell.date}
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

function getDayKey(date: string): DayKey {
  const dayOfWeek = new Date(date).getDay();
  switch (dayOfWeek) {
    case 1:
      return 't2';
    case 2:
      return 't3';
    case 3:
      return 't4';
    case 4:
      return 't5';
    case 5:
      return 't6';
    case 6:
      return 't7';
    case 0:
      return 'cn';
    default:
      throw new Error('Invalid day of week');
  }
}

function formatDateDisplay(date: string): string {
  return new Date(date).toLocaleDateString();
}

function getSlotNumber(slotName: string): number {
  const match = slotName.match(/Slot (\d+)/);
  if (match && match[1]) return Number.parseInt(match[1], 10);
  throw new Error('Invalid slot name');
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