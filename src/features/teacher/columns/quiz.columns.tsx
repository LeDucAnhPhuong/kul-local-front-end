import type { ColumnDef } from '@tanstack/react-table';
import { Activity, CalendarClock, BadgeCheck, Trash, Pencil } from 'lucide-react';
import { format } from 'date-fns-tz';
import type { Quiz } from '../components/quiz/quiz.type';

export const ContestColumns = (
  onDelete: (quiz: Quiz) => void,
  onUpdate: (quiz: Quiz) => void,
): ColumnDef<Quiz>[] => [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => <span className="font-medium text-gray-800">{row.getValue('title')}</span>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as Quiz['status'];
      const statusMap = {
        ongoing: {
          icon: <Activity className="h-4 w-4 text-green-500" />,
          label: 'Ongoing',
          bg: 'bg-green-100 text-green-700',
        },
        upcoming: {
          icon: <CalendarClock className="h-4 w-4 text-blue-500" />,
          label: 'Upcoming',
          bg: 'bg-blue-100 text-blue-700',
        },
        completed: {
          icon: <BadgeCheck className="h-4 w-4 text-gray-500" />,
          label: 'Completed',
          bg: 'bg-gray-100 text-gray-700',
        },
      };

      const data = statusMap[status];
      if (!data) return <span className="text-red-500">Invalid</span>;

      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md ${data.bg}`}
        >
          {data.icon}
          {data.label}
        </span>
      );
    },
  },
  {
    accessorKey: 'date',
    header: 'Start time',
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">
        {format(row.getValue('date'), 'dd/MM/yyyy HH:mm')}
      </span>
    ),
  },
  {
    accessorKey: 'due',
    header: 'Due date',
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">
        {format(row.getValue('due'), 'dd/MM/yyyy HH:mm')}
      </span>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex space-x-3">
        <button
          className="p-1"
          onClick={(e) => {
            e.stopPropagation();
            onUpdate(row.original);
          }}
        >
          <Pencil size={18} className="text-blue-500 hover:text-blue-700 cursor-pointer" />
        </button>
        <button
          className="p-1"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(row.original);
          }}
        >
          <Trash size={18} className="text-red-500 hover:text-red-700 cursor-pointer" />
        </button>
      </div>
    ),
  },
];
