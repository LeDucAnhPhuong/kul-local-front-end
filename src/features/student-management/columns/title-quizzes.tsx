import type { ColumnDef, Row } from '@tanstack/react-table';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { CalendarDays, Eye } from 'lucide-react';
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
import type { QuestionData } from '../quizzesInfo';


export type Quiz = {
  _id: number;
  title: string;
  date: string;
  isActive: boolean;
  created_by: number;
  updated_by: number;
  created_at: string; 
  updated_at: string; 
  questions: QuestionData[]; 
};

export const columns: ColumnDef<Quiz>[] = [
  {
    accessorKey: 'title',
    cell: ({ row }) => (
      <div className="w-full text-center font-semibold text-base min-h-[60px] flex justify-center items-center">
        {row.getValue('title')}
      </div>
    ),
  },
  {
    accessorKey: 'date',
    cell: ({ row }) => {
      const dateValue = row.getValue('date') as string;
      // Vì date trong data là string, ta parse nó thành Date
      const date = new Date(dateValue);
      const formattedDate = date.toLocaleDateString('vi-VN');
      
      return (
        <div className='flex items-center w-full gap-1 text-sm text-left text-blue-600'>
          <CalendarDays className="inline-block size-3" /> 
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
    cell: ({ row }) => {
      const isActive: boolean = row.getValue('isActive');
      const status = isActive ? 'Completed' : 'Pending';
      const statusColor = isActive ? 'completed' : 'pending';
      
      return (
        <Badge
          className={cn(
            'w-full block text-center text-white py-1 rounded',
            statusColor === 'completed'
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-yellow-500 hover:bg-yellow-600 text-white',
          )}
        >
          {status}
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

const Action = ({ row }: { row: Row<Quiz> }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex h-8 w-8 p-0 data-[state=open]:bg-muted" variant="ghost">
          <DotsHorizontalIcon className="w-4 h-4" />
          <span className="sr-only">Open Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Link className="flex w-full gap-2" to={`/quiz/${row.original?._id}`}>
            <Eye className="w-4 h-4 text-blue-500" />
            <span>View details</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};