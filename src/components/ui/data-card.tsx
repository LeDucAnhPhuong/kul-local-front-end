import React from 'react';
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table';
import { ArrowDownUp, Filter } from 'lucide-react';

import { Card } from './card';
import { Spinner } from './spinner';

import FilterModal from '@/components/ui/filter-table';
import SortModal from '@/components/ui/sort-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '../../hooks/use-media-query'; // tùy theo vị trí file



interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  onRowClick?: ({ data }: { data: TData }) => void;
  isUseToolbar?: boolean;
  isUsePagination?: boolean;
}

export default function CardList<TData, TValue>({
  columns,
  data,
  isLoading,
  onRowClick,
  isUseToolbar = true,
  isUsePagination = true,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    location: false,
    otherInformation: false,
  });

  const isMobile = useMediaQuery('(max-width: 768px)');

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnVisibility,
      columnFilters,
    },
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
  });

  return (
    <div>
      {isUseToolbar && (
        <div className="flex flex-col items-end justify-between gap-4 mb-4 md:flex-row">
          <Input
            className="flex-1 max-w-96"
            placeholder="Tìm kiếm..."
            type="search"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
          <div className="flex gap-2">
            <FilterModal
              opener={
                <Button variant={columnFilters?.length ? 'default' : 'secondary'}>
                  <Filter className="w-4 h-4" />
                </Button>
              }
              table={table}
            />
            <SortModal
              opener={
                <Button variant={sorting?.length ? 'default' : 'secondary'}>
                  <ArrowDownUp className="w-4 h-4" />
                </Button>
              }
              table={table}
            />
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center w-full py-10">
          <Spinner className="size-24" color="primary" />
        </div>
      ) : table.getRowModel().rows.length ? (
        <div
          className={cn(
            'mb-8 gap-6',
            isMobile ? 'space-y-4' : 'grid md:grid-cols-2 lg:grid-cols-3'
          )}
        >
          {table.getRowModel().rows.map((row) => {
            const record = row.original;

            return (
              <Card
                key={row.id}
                className={cn('p-4', onRowClick && 'cursor-pointer')}
                onClick={(event) => {
                  if (onRowClick) {
                    const isInteractive = (event.target as HTMLElement).closest('a, button');
                    if (!isInteractive) {
                      onRowClick({ data: record });
                    }
                  }
                }}
              >
                <div className="flex flex-col justify-between h-full space-y-2">
                  {row.getVisibleCells().map((cell) => (
                    <div key={cell.id} className="flex justify-between">
                      {typeof cell.column.columnDef.header === 'string' && (
                        <div className="flex-1 text-base font-bold">
                          {cell.column.columnDef.header}:
                        </div>
                      )}
                      <div className="flex justify-end flex-1 text-base text-end">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <p className="mt-4 text-center text-muted-foreground">Không tìm thấy dữ liệu</p>
      )}

      {!isLoading && table.getRowModel().rows.length !== 0 && isUsePagination && (
        <DataTablePagination table={table} />
      )}
    </div>
  );
}
