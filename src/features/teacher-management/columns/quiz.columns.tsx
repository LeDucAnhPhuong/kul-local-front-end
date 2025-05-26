import type { ColumnDef } from '@tanstack/react-table';
import { PlayCircle, Clock, CheckCircle, Trash } from 'lucide-react';
import type { Question } from './question';
export type Contest = {
  id: string;
  title: string;
  date: string;
  isActive: boolean;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;

  status: 'ongoing' | 'upcoming' | 'finished';
  startAt: string;
  endAt: string;
  questions?: Question[];
};

export const ContestColumns = (onDelete: (quiz: Contest) => void): ColumnDef<Contest>[] => [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => row.getValue('title'),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as keyof typeof statusMarkup;
      const statusStyles = {
        ongoing: 'text-green-500',
        upcoming: 'text-yellow-500',
        finished: 'text-gray-500',
      };
      const statusMarkup = {
        ongoing: {
          icon: <PlayCircle className="h-4 w-4 text-green-500" />,
          label: 'ongoing',
        },
        upcoming: {
          icon: <Clock className="h-4 w-4 text-yellow-500" />,
          label: 'upcoming',
        },
        finished: {
          icon: <CheckCircle className="h-4 w-4 text-gray-500" />,
          label: 'finished',
        },
      };

      return (
        <span className={statusStyles[status]}>
          <span className="flex items-center gap-2">
            {statusMarkup[status].icon}
            <span className="font-medium">{statusMarkup[status].label}</span>
          </span>
        </span>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    cell: ({ row }) => new Date(row.getValue('created_at')).toLocaleDateString('vi-VN'),
  },
  {
    accessorKey: 'startAt',
    header: 'Start At',
    cell: ({ row }) => new Date(row.getValue('startAt')).toLocaleDateString('vi-VN'),
  },
  {
    accessorKey: 'endAt',
    header: 'End At',
    cell: ({ row }) => new Date(row.getValue('endAt')).toLocaleDateString('vi-VN'),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Trash
          className="text-red-500 hover:text-red-700 cursor-pointer"
          onClick={() => onDelete(row.original)}
        />
      </div>
    ),
  },
];
