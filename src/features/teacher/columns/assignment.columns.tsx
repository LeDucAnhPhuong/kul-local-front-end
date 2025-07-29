import { FileText } from 'lucide-react';
import type { Assignment } from '../types/assignment';
import { Badge } from '@/components/ui/badge';
import type { Class } from '@/features/class-management/columns/class-management';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';


const GetType = (type: number) => {
  console.log('type :>> ', type);
  switch (type) {
    case 0:
      return (
        <Badge className="bg-green-500 text-white" variant="outline">
          Check 1
        </Badge>
      );
    case 1:
      return (
        <Badge className="bg-yellow-500 text-white" variant="outline">
          Check 2
        </Badge>
      );
    case 2:
      return (
        <Badge variant="outline" className="text-xs bg-blue-500 text-white">
          Essay
        </Badge>
      );
    default:
      return type;
  }
};

export const assignmentColumns: ColumnDef<Assignment>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => row.getValue('title'),
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type: number = row.getValue('type');

      return GetType(type);
    },
  },
  {
    accessorKey: 'startTime',
    header: 'Start Time',
    cell: ({ row }) => format(new Date(row.getValue('startTime')), 'Pp'),
  },
  {
    accessorKey: 'dueTime',
    header: 'Due Time',
    cell: ({ row }) => format(new Date(row.getValue('dueTime')), 'Pp'),
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const now = new Date();
      const dueTime = new Date(row.getValue('dueTime'));
      const startTime = new Date(row.getValue('startTime'));
      const isUpcoming = now < startTime;
      const isOutdated = now > dueTime;
      return (
        <Badge
          className={
            isUpcoming
              ? 'bg-yellow-500 text-white'
              : isOutdated
              ? 'bg-red-500 text-white'
              : 'bg-green-500 text-white'
          }
          variant="outline"
        >
          {isUpcoming ? 'Upcoming' : isOutdated ? 'Outdated' : 'Active'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'class',
    header: 'Class Name',
    cell: ({ row }) => {
      const classInfor: Class = row.getValue('class');
      return <div>{classInfor?.name ?? 'N/A'}</div>;
    },
  },
  {
    accessorKey: 'content',
    header: 'File',
    cell: ({ row }) => {
      const url = row.getValue('content') as string;
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-blue-600 underline hover:text-blue-800"
        >
          <FileText className="w-4 h-4 mr-1" />
          File
        </a>
      );
    },
  },
];
