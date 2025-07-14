import type { ColumnDef, Row } from '@tanstack/react-table';
import { Circle, CircleCheck } from 'lucide-react';
import { useState } from 'react';

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
  scheduleData,
  setAttendanceList,
}: {
  row: Row<Member>;
  scheduleData?: any[];
  setAttendanceList?: React.Dispatch<React.SetStateAction<{ user_id: string; status: number }[]>>;
}) => {
  const userId = row.original.id;
  const initialStatus = scheduleData?.find((entry) => entry.userId === userId)?.status ?? 0;
  const [checked, setChecked] = useState(initialStatus);

  const toggleChecked = () => {
    const newStatus = checked ? 0 : 1;
    setChecked(!checked);
    if (setAttendanceList) {
      setAttendanceList((prev) => {
        const existing = prev.find((item) => item.user_id === userId);
        if (existing) {
          return prev.map((item) =>
            item.user_id === userId ? { ...item, status: newStatus } : item,
          );
        }
        return [...prev, { user_id: userId, status: newStatus }];
      });
    }
  };

  return checked ? (
    <div onClick={toggleChecked} className="flex items-center gap-1 cursor-pointer">
      <CircleCheck className="text-green-500 w-5 h-5" />
      <span className="text-green-600 text-sm font-medium">Present</span>
    </div>
  ) : (
    <div onClick={toggleChecked} className="flex items-center gap-1 cursor-pointer">
      <Circle className="text-gray-400 w-5 h-5" />
      <span className="text-gray-500 text-sm font-medium">Absent</span>
    </div>
  );
};

export const columns = (
  scheduleData?: any[],
  setAttendanceList?: React.Dispatch<React.SetStateAction<{ user_id: string; status: number }[]>>,
): ColumnDef<Member>[] => {
  return [
    {
      accessorKey: 'profile_image',
      header: 'Avatar',
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          <img
            src={row.getValue('profile_image') || '/default-avatar.png'}
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
        return <div className="font-medium">{`${lastName} ${firstName}`}</div>;
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
          setAttendanceList={setAttendanceList}
        />
      ),
    },
  ];
};
