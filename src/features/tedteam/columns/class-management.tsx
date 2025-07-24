import type { ColumnDef, Row } from '@tanstack/react-table';
import { CalendarDays, ClipboardPen } from 'lucide-react';
import { Link } from 'react-router';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { filterDateRange } from '@/utils/table';

export type Class = {
  id: string;
  name: string;
  isActive: boolean;
  created_at?: string;
  schedule?: string;
  startTime?: string;
};
export const columns: ColumnDef<Class>[] = [
  {
    accessorKey: 'name',
    header: 'Class Name',
    cell: ({ row }) => <div className="font-semibold text-base">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'startTime',
    header: 'Start Date',
    cell: () => {
      const date = new Date();
      const formattedDate = date.toLocaleDateString('vi-VN');

      return (
        <div className="text-sm">
          <CalendarDays className="inline-block size-3" />
          {formattedDate}
        </div>
      );
    },
    meta: {
      filterVariant: 'numberRange',
    },
    filterFn: filterDateRange,
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const value: boolean = row.getValue('isActive') ?? false;
      return (
        <Badge
          className={cn(value ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600')}
        >
          <span className="font-medium">{value ? 'Active' : 'Inactive'}</span>
        </Badge>
      );
    },
    meta: {
      filterVariant: 'select',
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <Action row={row} />,
  },
];

const Action = ({ row }: { row: Row<Class> }) => {
  return (
    <div>
      <Link
        className="flex gap-2 w-full"
        to={`/detail-class/${row.original?.id}?schedule=${row.original?.schedule}`}
      >
        <ClipboardPen className="" />
      </Link>
    </div>
  );
};
