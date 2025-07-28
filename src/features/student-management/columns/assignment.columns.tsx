import type { ColumnDef }  from '@tanstack/react-table';
import { format }  from 'date-fns';
import { Badge }  from '@/components/ui/badge';
import type { Assignment }  from '@/features/teacher/types/assignment';
import type { Class }  from '@/features/schedule-management/data.type';
import type { User }  from '@/features/account-management/columns/account-management';

const GetType = (type: number) => {
console.log('type :>> ', type);
switch (type) {
  case 0:
    return (
      <Badge className="text-white bg-green-500" variant="outline">
        Check 1
      </Badge>
    );
  case 1:
    return (
      <Badge className="text-white bg-yellow-500" variant="outline">
        Check 2
      </Badge>
    );
  case 2:
    return (
      <Badge variant="outline" className="text-xs text-white bg-blue-500">
        Essay
      </Badge>
    );
  default:
    return type;
}
};

export const assignmentStudentColumns: ColumnDef<Assignment>[] = [
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
  accessorKey: 'class',
  header: 'Class Name',
  cell: ({ row }) => {
    const classInfor: Class = row.getValue('class');
    return <div>{classInfor?.name ?? 'N/A'}</div>;
  },
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
  accessorKey: 'createdByUser',
  header: 'Created By',
  cell: ({ row }) => {
    const user: User = row.getValue('createdByUser');
    return <div>{user?.email ?? 'N/A'}</div>;
  },
},
];
