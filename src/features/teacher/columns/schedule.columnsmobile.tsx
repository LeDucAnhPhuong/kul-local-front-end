import type { ColumnDef, Row } from '@tanstack/react-table';

export type SlotSchedule = {
  day: string; // 'Mon', 'Tue', ...
  Slot1?: ScheduleCell;
  Slot2?: ScheduleCell;
  Slot3?: ScheduleCell;
  Slot4?: ScheduleCell;
  Slot5?: ScheduleCell;
  Slot6?: ScheduleCell;
};

export type ScheduleCell = {
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
};

export const columns: ColumnDef<SlotSchedule>[] = [
  {
    accessorKey: 'day',
    header: 'Day',
    cell: ({ row }) => {
      const dayCode = row.getValue('day') as string;

      const dayMap: Record<string, string> = {
        t2: 'Mon',
        t3: 'Tue',
        t4: 'Wed',
        t5: 'Thu',
        t6: 'Fri',
        t7: 'Sat',
        cn: 'Sun',
      };

      return <div className="font-semibold text-base md:text-lg">{dayMap[dayCode] || dayCode}</div>;
    },
  },

  ...['Slot1', 'Slot2', 'Slot3'].map((slotKey) => ({
    accessorKey: slotKey,
    header: slotKey,
    cell: ({ row }: { row: Row<SlotSchedule> }) => {
      const cell: ScheduleCell | undefined = row.getValue(slotKey);
      if (!cell) {
        return <div className="text-red-500 text-center text-base">-</div>;
      }

      return (
        <div className="flex flex-col gap-1 px-1 py-2 rounded-md bg-muted/20 min-w-[120px] max-w-[160px]">
          {/* Topic and Instructor */}
          <div>
            <p className="text-xs font-semibold leading-tight md:text-sm line-clamp-2">
              {cell.topic}
            </p>
            <p className="text-xs text-muted-foreground">by {cell.instructor}</p>
          </div>

          {/* Room and Class */}
          <div className="text-xs leading-tight text-gray-600">
            Room {cell.room_id} | Class {cell.class_id}
          </div>

          {/* Status Badge */}
          {/* <div
            className={`text-xs w-fit px-2 py-1 rounded-md text-white ${
              cell.status === 'not yet'
                ? 'bg-orange-500'
                : cell.status === 'absent'
                ? 'bg-red-500'
                : 'bg-green-500'
            }`}
          >
            {cell.status === 'not yet'
              ? 'Not Yet'
              : cell.status === 'absent'
              ? 'Absent'
              : 'Present'}
          </div> */}

          {/* Time */}
          <div className="text-xs font-medium leading-tight text-green-700">{cell.time}</div>

          {/* Date */}
          <div className="text-xs font-medium leading-tight text-blue-600">{cell.date}</div>
        </div>
      );
    },
    meta: {
      sort: false,
      filter: false,
    },
  })),
];
