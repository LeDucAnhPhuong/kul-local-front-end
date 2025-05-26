import type { ColumnDef, Row } from '@tanstack/react-table';

export type SlotSchedule = {
  slot: string; // ví dụ: 'Slot 1'
  Mon?: ScheduleCell;
  Tue?: ScheduleCell;
  Wed?: ScheduleCell;
  Thu?: ScheduleCell;
  Fri?: ScheduleCell;
  Sat?: ScheduleCell;
  Sun?: ScheduleCell;
};

export type ScheduleCell = {
  courseCode: string;
  location: string;
  time: string;
  meetUrl?: string;
  eduNextUrl?: string;
};

export const columns: ColumnDef<SlotSchedule>[] = [
  {
    accessorKey: 'slot',
    header: 'Slot',
    cell: ({ row }) => <div className="font-medium">{row.getValue('slot')}</div>,
  },
  ...['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayKey) => ({
    accessorKey: dayKey,
    header: dayKey.toUpperCase(),
    cell: ({ row }: { row: Row<SlotSchedule> }) => {
      const cell: ScheduleCell | undefined = row.getValue(dayKey);
      if (!cell) return <div className="flex ml-8 items-center text-red-500 text-2xl">-</div>;

      return (
        <div className="space-y-1">
          <div className="md:block flex gap-2 items-center">
            <p className="font-semibold">{cell.courseCode}</p>
            <p className="text-sm text-muted-foreground">at {cell.location}</p>
          </div>

          <div className="text-xs text-green-600 font-medium">{cell.time}</div>
        </div>
      );
    },
    meta: {
      sort: false,
      filter: false,
    },
  })),
];
//
