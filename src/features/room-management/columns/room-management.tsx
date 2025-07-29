import type { ColumnDef, Row } from '@tanstack/react-table';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Pencil } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons';
import { useDeleteRoomMutation } from '../api.room';
import { toast } from 'sonner';

export type Room = {
  id?: string;
  name?: string;
  capacity?: number;
  isActive?: boolean;
  location?: string;
  myLocation?: string;
};
export const columns: ColumnDef<Room>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'capacity',
    header: 'Capacity',
    cell: ({ row }) => {
      const value: number = row.getValue('capacity') ?? 0;
      return <span className="font-medium">{value}</span>;
    },
  },
  {
    accessorKey: 'myLocation',
    header: 'Location',
    cell: ({ row }) => {
      return <span className="font-medium">{row.getValue('myLocation')}</span>;
    },
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
    id: 'actions',
    cell: ({ row }) => <Action row={row} />,
  },
];

const Action = ({ row }: { row: Row<Room> }) => {
  const [deleteRoom] = useDeleteRoomMutation();

  async function handleDelete(id: string | undefined) {
    if (!id) return;
    const isActive = row.original?.isActive;
    const idToast = toast.loading(`${isActive ? 'Locking' : 'Unlocking'} room...`);
    try {
      await deleteRoom(id).unwrap();
      toast.success(`${isActive ? 'Room locked' : 'Room unlocked'} successfully`, {
        id: idToast,
      });
    } catch (error) {
      toast.error(`Failed to ${isActive ? 'lock' : 'unlock'} room`, {
        id: idToast,
      });
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
          <Link
            className="flex gap-2 w-full"
            to={`/room-management/${row.original?.id}/update-room`}
          >
            <Pencil className="w-4 h-4 text-blue-500" />
            <span>Update</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <button
            className="flex gap-2 w-full items-center"
            onClick={() => {
              handleDelete(row.original?.id);
            }}
          >
            {row.original?.isActive ? (
              <CrossCircledIcon className="h-4 w-4 text-red-500" />
            ) : (
              <CheckCircledIcon className="h-4 w-4 text-green-500" />
            )}
            {<span className="">{row.original?.isActive ? 'Lock Room' : 'Unlock Room'}</span>}
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
