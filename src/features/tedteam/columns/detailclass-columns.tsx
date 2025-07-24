import type { ColumnDef, Row } from '@tanstack/react-table';
import { Circle, CircleCheck } from 'lucide-react';

export type Member = {
  id: string;
  fullname: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
};

const AttendanceStatus = ({
  row,
  setAttendanceList,
  attendanceList = [],
}: {
  row: Row<Member>;
  scheduleData?: any[];
  attendanceList?: { user_id: string; status: number }[];
  setAttendanceList: React.Dispatch<React.SetStateAction<{ user_id: string; status: number }[]>>;
}) => {
  const userId = row.original.id;
  const status = attendanceList?.find((item) => item.user_id === userId)?.status || 0;

  console.log('status :>> ', status);

  console.log('attendanceList :>> ', attendanceList);

  const toggleChecked = () => {
    setAttendanceList((prev) => {
      const existing = prev.find((item) => item.user_id === userId);
      console.log('existing :>> ', existing);
      const newStatus = existing?.status === 0 ? 1 : 0; // Toggle between 0 (absent) and 1 (present)
      if (existing) {
        return prev.map((item) =>
          item.user_id === userId ? { ...item, status: newStatus } : item,
        );
      }
      return prev;
    });
  };

  return status === 1 ? (
    <button onClick={() => toggleChecked()} className="flex items-center gap-1 cursor-pointer">
      <CircleCheck className="text-green-500 w-5 h-5" />
      <span className="text-green-600 text-sm font-medium">Present</span>
    </button>
  ) : (
    <button onClick={() => toggleChecked()} className="flex items-center gap-1 cursor-pointer">
      <Circle className="text-gray-400 w-5 h-5" />
      <span className="text-gray-500 text-sm font-medium">Absent</span>
    </button>
  );
};

export const columns = (
  scheduleData?: any[],
  setAttendanceList?: React.Dispatch<React.SetStateAction<{ user_id: string; status: number }[]>>,
  attendanceList?: { user_id: string; status: number }[],
): ColumnDef<Member>[] => {
  return [
    {
      accessorKey: 'profileImage',
      header: 'Avatar',
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          <img
            src={row.getValue('profileImage') || '/default-avatar.png'}
            alt="Avatar"
            className="w-10 h-10 rounded-full"
          />
        </div>
      ),
      meta: {
        filterVariant: 'text',
      },
    },
    {
      accessorKey: 'fullname',
      header: 'Name',
      cell: ({ row }) => {
        const { firstName, lastName } = row.original;
        return (
          <div className="font-medium">
            {lastName || firstName ? `${lastName} ${firstName}` : 'Unknown'}
          </div>
        );
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <div>{row.getValue('email')}</div>,
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      id: 'actions',
      cell: ({ row }) => (
        <AttendanceStatus
          row={row}
          scheduleData={scheduleData}
          setAttendanceList={setAttendanceList!}
          attendanceList={attendanceList}
        />
      ),
    },
  ];
};
