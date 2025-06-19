import type { ColumnDef } from '@tanstack/react-table';
import { PlayCircle, Clock, CheckCircle, Trash, Settings } from 'lucide-react';
import type { Question } from '../functionaly/question';
export type Contest = {
  id: string;
  title: string;
  date: string;
  isActive: boolean;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  topic: string;
  status: 'ongoing' | 'upcoming' | 'completed';
  startAt: string;
  endAt: string;
  questions?: Question[];
};

export const ContestColumns = (onDelete: (quiz: Contest) => void, onUpdate: (quiz: Contest) => void): ColumnDef<Contest>[] => [
  {
    accessorKey: 'title',
    header: 'TITLE',
    cell: ({ row }) => row.getValue('title'),
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell: ({ row }) => {
      const statusMarkup = {
        ongoing: {
          icon: <PlayCircle className="h-4 w-4 text-green-500" />,
          label: 'Ongoing',
        },
        upcoming: {
          icon: <Clock className="h-4 w-4 text-yellow-500" />,
          label: 'Upcoming',
        },
        completed: {
          icon: <CheckCircle className="h-4 w-4 text-gray-500" />,
          label: 'Completed',
        },
      };

      const status = row.getValue('status') as keyof typeof statusMarkup;

      const data = statusMarkup[status];
      if (!data) return <span className="text-red-500">Invalid</span>;

      return (
        <span className="flex items-center gap-2 font-medium">
          {data.icon}
          {data.label}
        </span>
      );
    },
  },  
  // {
  //   accessorKey: 'created_at',
  //   header: 'Created Day',
  //   cell: ({ row }) => new Date(row.getValue('created_at')).toLocaleDateString('vi-VN'),
  // },
  // {
  //   accessorKey: 'startAt',
  //   header: 'Start Day',
  //   cell: ({ row }) => new Date(row.getValue('startAt')).toLocaleDateString('vi-VN'),
  // },
  {
    accessorKey: 'topic',
    header: 'TOPIC',
    cell: ({ row }) => row.getValue('topic'),
  },
  {
    accessorKey: 'endAt',
    header: 'DUE DATE',
    cell: ({ row }) => new Date(row.getValue('endAt')).toLocaleDateString('vi-VN'),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Settings
          className="text-gray-500 hover:text-gray-700 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onUpdate(row.original);
          }}
        />
        <Trash
          className="text-red-500 hover:text-red-700 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(row.original);
          }}
        />
        
      </div>
    ),
  },
];
