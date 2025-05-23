import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ColumnDef, Row } from '@tanstack/react-table';

export type SlotSchedule = {
  slot: string; // ví dụ: 'Slot 1'
  t2?: ScheduleCell;
  t3?: ScheduleCell;
  t4?: ScheduleCell;
  t5?: ScheduleCell;
  t6?: ScheduleCell;
  t7?: ScheduleCell;
  cn?: ScheduleCell;
};

type ScheduleCell = {
  courseCode: string;
  location: string;
  time: string;
  status: 'Not yet' | 'Completed';
  meetUrl?: string;
  eduNextUrl?: string;
};

export const columns: ColumnDef<SlotSchedule>[] = [
  {
    accessorKey: 'slot',
    header: 'Ca học',
    cell: ({ row }) => <div className="font-medium">{row.getValue('slot')}</div>,
  },
  ...['t2', 't3', 't4', 't5', 't6', 't7', 'cn'].map((dayKey) => ({
    accessorKey: dayKey,
    header: dayKey.toUpperCase(),
    cell: ({ row }: { row: Row<SlotSchedule> }) => {
      const cell: ScheduleCell | undefined = row.getValue(dayKey);
      if (!cell) return <div className="flex ml-8 items-center text-red-500 text-2xl">-</div>;

      return (
        <div className="space-y-1">
          <div className='md:block flex gap-2 items-center'>
            <p className="font-semibold">{cell.courseCode}</p>
            <p className="text-sm text-muted-foreground">at {cell.location}</p>
          </div>
          <Badge
            className={cn(
              'text-sm text-white',
              cell.status === 'Not yet'
                ? 'bg-red-500 hover:bg-red-600 active:bg-red-700 focus:ring-red-500'
                : 'focus:ring-green-500 active:bg-green-700 hover:bg-green-600 bg-green-500',
            )}
          >
            {cell.status === 'Not yet' ? 'absent' : 'attended'}
          </Badge>
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
