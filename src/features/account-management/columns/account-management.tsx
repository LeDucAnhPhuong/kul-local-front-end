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
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { filterDateRange } from '@/utils/table';
import { CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons';
import { toast } from 'sonner';
import { useDeleteUserMutation } from '../api.user';

export type User = {
  id: string;
  name: string;
  profileImage: string | null;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  createdAt: string;
};
export const columns: ColumnDef<User>[] = [
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
    accessorKey: 'createdAt',
    header: 'Create Date',
    cell: ({ row }) => {
      const createdAt = row.getValue('createdAt');
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
  const [deleteUser] = useDeleteUserMutation();

  async function handleDeleteUser(id: string | undefined) {
    if (!id) return;
    const isActive = row.original?.isActive;
    try {
      await deleteUser(id).unwrap();
      toast.success(`User ${isActive ? 'locked' : 'unlocked'} successfully`);
    } catch (error) {
      toast.error(`Failed to ${isActive ? 'lock' : 'unlock'} user status`);
    }
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex h-8 w-8 p-0 data-[state=open]:bg-muted" variant="ghost">
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <button
            className="flex gap-2 w-full items-center"
            onClick={() => handleDeleteUser(row.original?.id)}
          >
            {row.original?.isActive ? (
              <CrossCircledIcon className="h-4 w-4 text-red-500" />
            ) : (
              <CheckCircledIcon className="h-4 w-4 text-green-500" />
            )}
            {<span className="">{row.original?.isActive ? 'Lock Account' : 'Unlock Account'}</span>}
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
