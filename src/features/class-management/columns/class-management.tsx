import type { ColumnDef, Row } from '@tanstack/react-table';
import { CheckCircledIcon, CrossCircledIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';
import { CalendarDays, Eye, Pencil } from 'lucide-react';
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
import { filterDateRange } from '@/utils/table';
import { useDeleteClassMutation } from '../api.class';
import { toast } from 'sonner';

export type Class = {
  id: string;
  name: string;
  isActive: boolean;
  createdAt?: string;
  startTime?: string;
  endTime?: string;
};
export const columns: ColumnDef<Class>[] = [
  {
    accessorKey: 'name',
    header: 'Class Name',
    cell: ({ row }) => <div className="font-semibold text-base">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'startTime',
    header: 'Start Time',
    cell: ({ row }) => {
      const dateValue = row.getValue('startTime') as string;
      const date = new Date(dateValue);
      const formattedDate = date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      return (
        <div className="text-sm flex items-center gap-1">
          <CalendarDays className="inline-block size-4 text-muted-foreground" />
          {formattedDate}
        </div>
      );
    },
    meta: {
      filterVariant: 'numberRange',
    },
    filterFn: filterDateRange,
  },
  {
    accessorKey: 'endTime',
    header: 'End Time',
    cell: ({ row }) => {
      const dateValue = row.getValue('endTime') as string;
      const date = new Date(dateValue);
      const formattedDate = date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      return (
        <div className="text-sm flex items-center gap-1">
          <CalendarDays className="inline-block size-4 text-muted-foreground" />
          {formattedDate}
        </div>
      );
    },
    meta: {
      filterVariant: 'numberRange',
    },
    filterFn: filterDateRange,
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      const dateValue = row.getValue('createdAt') as string;
      const date = new Date(dateValue);
      const formattedDate = date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      return (
        <div className="text-sm flex items-center gap-1">
          <CalendarDays className="inline-block size-4 text-muted-foreground" />
          {formattedDate}
        </div>
      );
    },
    meta: {
      filterVariant: 'numberRange',
    },
    filterFn: filterDateRange,
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

const Action = ({ row }: { row: Row<Class> }) => {
  const [deleteClass] = useDeleteClassMutation();

  async function handleDeleteClass(id: string | undefined) {
    if (!id) return;
    const isActive = row.original?.isActive;
    const idToast = toast.loading(`${isActive ? 'Locking' : 'Unlocking'} class...`);
    try {
      await deleteClass(id).unwrap();
      toast.success(`${isActive ? 'Class locked' : 'Class unlocked'} successfully`, {
        id: idToast,
      });
    } catch (error) {
      toast.error(`Failed to ${isActive ? 'lock' : 'unlock'} class`, {
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
          <Link className="flex gap-2 w-full" to={`/class-management/${row.original?.id}`}>
            <Eye className="w-4 h-4 text-blue-500" />
            <span>View Detail</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link
            className="flex gap-2 w-full"
            to={`/class-management/${row.original?.id}/update-class`}
          >
            <Pencil className="w-4 h-4 text-blue-500" />
            <span>Update</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <button
            className="flex gap-2 w-full items-center"
            onClick={() => {
              handleDeleteClass(row.original?.id);
            }}
          >
            {row.original?.isActive ? (
              <CrossCircledIcon className="h-4 w-4 text-red-500" />
            ) : (
              <CheckCircledIcon className="h-4 w-4 text-green-500" />
            )}
            {<span className="">{row.original?.isActive ? 'Lock Class' : 'Unlock Class'}</span>}
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
