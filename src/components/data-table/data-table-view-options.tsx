'use no memo';

import { MixerHorizontalIcon } from '@radix-ui/react-icons';
import type { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import FilterModal from '../ui/filter-table';
import { Filter } from 'lucide-react';

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({ table }: DataTableViewOptionsProps<TData>) {
  return (
    <div className="flex gap-2">
      <FilterModal
        opener={
          <Button
            variant={table?.getState()?.columnFilters?.length ? 'outline' : 'secondary'}
            className="ml-auto hidden h-8 lg:flex"
            size="sm"
          >
            <Filter className="h-4 w-4" />
            <p>Filter</p>
          </Button>
        }
        table={table}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="ml-auto hidden h-8 lg:flex" size="sm" variant="outline">
            <MixerHorizontalIcon className="" />
            Tuỳ chỉnh
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuLabel>Xem cột</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  className="capitalize"
                  onCheckedChange={(value: boolean) => column.toggleVisibility(!!value)}
                >
                  {column.columnDef?.header as string}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
