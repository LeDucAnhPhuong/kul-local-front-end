import type { ColumnDef, Row } from '@tanstack/react-table';
import { Circle, CircleCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { filterDateRange } from '@/utils/table';
import { useState } from 'react';

export type User = {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  created_at: string;
};
export const columns: ColumnDef<User>[] = [
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
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <div>{row.getValue('email')}</div>,
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
    accessorKey: 'created_at',
    header: 'Create Date',
    cell: ({ row }) => {
      const createdAt = row.getValue('created_at');
      const formattedDate =
        typeof createdAt === 'string' ? new Date(createdAt).toLocaleDateString() : createdAt;
      return <div>{`${formattedDate}`}</div>;
    },
    meta: {
      filterVariant: 'dateRange',
    },
    filterFn: filterDateRange,
  },
  {
    id: 'actions',
    cell: ({ row }) => <Action row={row} />,
  },
];

const Action = ({ row }: { row: Row<User> }) => {
  const [checked, setChecked] = useState(false);

  const toggleChecked = () => {
    setChecked(!checked);
  };
  return (
     <Button onClick={toggleChecked} className="flex items-center gap-2">
      {checked ? (
        <CircleCheck className="text-green-500 w-5 h-5" />
      ) : (
        <Circle className="text-gray-400 w-5 h-5" />
      )}
    </Button>
  );
};
