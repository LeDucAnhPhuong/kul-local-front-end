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
  courseCode: string;
  location: string;
  time: string;
  meetUrl?: string;
  eduNextUrl?: string;
};
export const columns: ColumnDef<SlotSchedule>[] = [
  {
    accessorKey: 'day',
    header: 'Day',
    cell: ({ row }) => (
      <div className="font-semibold text-base md:text-lg">{row.getValue('day')}</div>
    ),
  },
  ...['Slot1', 'Slot2', 'Slot3', 'Slot4', 'Slot5', 'Slot6'].map((slotKey) => ({
    accessorKey: slotKey,
    header: slotKey,
    cell: ({ row }: { row: Row<SlotSchedule> }) => {
      const cell: ScheduleCell | undefined = row.getValue(slotKey);
      if (!cell) {
        return <div className="text-red-500 text-center text-base">-</div>;
      }

      return (
        <div className="flex flex-col gap-1 px-1 py-2 rounded-md bg-muted/20">
          <div className="text-sm font-medium">{cell.courseCode}</div>
          <div className="text-xs text-muted-foreground">📍 {cell.location}</div>
          <div className="text-xs font-medium text-green-700">{cell.time}</div>
        </div>
      );
    },
    meta: {
      sort: false,
      filter: false,
    },
  })),
];
