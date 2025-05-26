import type { ColumnDef, Row } from '@tanstack/react-table';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { filterDateRange } from '@/utils/table';

export type Quiz = {
  _id: number;
  title: string;
  date: Date;
  isActive: boolean;
  created_by: number;
  updated_by: number;
  created_at: Date;
  updated_at: Date;
};

export const columns: ColumnDef<Quiz>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => <div className="font-medium">{row.getValue('title')}</div>,
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      const date = row.getValue('date');
      const formattedDate = date instanceof Date 
        ? date.toLocaleDateString('vi-VN')
        : new Date(date as string).toLocaleDateString('vi-VN');
      return <div>{formattedDate}</div>;
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
      const isActive: boolean = row.getValue('isActive');
      const status = isActive ? 'Completed' : 'Pending';
      const statusColor = isActive ? 'completed' : 'pending';
      
      return (
        <Badge
          className={cn(
            statusColor === 'completed' 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'bg-yellow-500 hover:bg-yellow-600 text-white',
          )}
        >
          {status}
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

const Action = ({ row }: { row: Row<Quiz> }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex h-8 w-8 p-0 data-[state=open]:bg-muted" variant="ghost">
          <DotsHorizontalIcon className="w-4 h-4" />
          <span className="sr-only">Open Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Link className="flex w-full gap-2" to={`/quiz/${row.original?._id}`}>
            <Eye className="w-4 h-4 text-blue-500" />
            <span>Xem chi tiết</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};