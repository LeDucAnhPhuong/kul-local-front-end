import type { ColumnDef } from '@tanstack/react-table';
import { CalendarDays, UserCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { filterDateRange } from '@/utils/table';
import { Link } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const getStatus = (status: string) => {
  switch (status) {
    case 'done':
      return 'Done';
    case 'not_yet':
      return 'Not started';
    case 'cant_start':
      return 'Cannot start';
    case 'upcoming':
      return 'Upcoming';
    default:
      return status;
  }
};

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <div className="font-semibold text-center min-h-[60px] flex items-center justify-center">
        {row.getValue('title')}
      </div>
    ),
  },
  {
    header: 'Date',
    cell: ({ row }) => {
      const start = new Date(row.original.date).toLocaleDateString('en-US');
      const end = new Date(row.original.due).toLocaleDateString('en-US');

      return (
        <div className="text-sm text-blue-600 flex flex-col">
          <div className="flex items-center gap-1">
            <CalendarDays className="size-3" />
            <span>
              {start} - {end}
            </span>
          </div>
        </div>
      );
    },
    meta: {
      filterVariant: 'numberRange',
    },
    filterFn: filterDateRange,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const baseClasses = 'text-white px-2 py-1 rounded text-center';
      const badgeClasses = cn(
        baseClasses,
        status === 'done' && 'bg-green-500',
        status === 'not_yet' && 'bg-yellow-500',
        status === 'cant_start' && 'bg-red-500',
      );

      if (status === 'not_yet') {
        return (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Badge className={badgeClasses}>{getStatus(status)}</Badge>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Bạn muốn bắt đầu bài kiểm tra này?</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Huỷ</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Link to={`/quiz/${row.original.id}`}>Bắt đầu</Link>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        );
      }

      return <Badge className={badgeClasses}>{getStatus(status)}</Badge>;
    },
    meta: {
      filterVariant: 'select',
    },
  },
  {
    header: 'Coach',
    cell: ({ row }) => {
      const coach = row.original.coach;
      return (
        <div className="flex items-center gap-2">
          <img
            src={coach.profileImage}
            alt={coach.firstName}
            className="w-8 h-8 rounded-full object-cover border"
          />
          <span className="text-sm">
            {coach.lastName} {coach.firstName}
          </span>
        </div>
      );
    },
  },
];
