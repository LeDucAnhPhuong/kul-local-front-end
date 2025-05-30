'use client';

import React from 'react';
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table';

import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';
import { DataTableColumnHeader } from './data-table-column-header';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '../ui/input';
import FilterModal from '../ui/filter-table';
import { Button } from '../ui/button';
import { ArrowDownUp, Filter } from 'lucide-react';
import SortModal from '../ui/sort-table';
import { Spinner } from '../ui/spinner';
import { Card } from '../ui/card';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  onRowClick?: ({ data }: { data: TData }) => void;
  isUseToolbar?: boolean;
  isUsePagination?: boolean;
}

export const LoadingTable = ({ length }: { length: number }) => (
  <TableRow>
    <TableCell className="h-24 text-center" colSpan={length}>
      <div className="flex items-center justify-center">
        <svg
          className="w-5 h-5 mr-3 animate-spin text-primary"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            fill="currentColor"
          />
        </svg>
        Downloading...
      </div>
    </TableCell>
  </TableRow>
);

export default function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  onRowClick,
  isUseToolbar = true,
  isUsePagination = true,
}: DataTableProps<TData, TValue>) {
  const isMobile = useMediaQuery('(max-width: 1024px)');

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    location: false,
    otherInformation: false,
  });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

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
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
  });

  return (
    <div>
      {!isMobile && (
        <div className="hidden space-y-4 lg:block">
          {!isLoading && isUseToolbar && <DataTableToolbar table={table} />}
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        <DataTableColumnHeader
                          column={header.column}
                          title={header.column.columnDef.header as string}
                        />
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <LoadingTable length={columns.length} />
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell className="h-24 text-center" colSpan={columns.length}>
                      No data results
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {!isLoading && isUsePagination && <DataTablePagination table={table} />}
        </div>
      )}

      {isMobile && (
        <div className="block lg:hidden">
          <div className="flex items-end justify-between gap-4 mb-4">
            <Input
              className="flex-1 max-w-96"
              placeholder="Enter search..."
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
          {isLoading ? (
            <div className="flex items-center justify-center w-full py-10">
              <Spinner className="size-24" color="primary" />
            </div>
          ) : table?.getRowModel()?.rows?.length ? (
            <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
              {table.getRowModel().rows.map((row) => {
                const record = row.original;
                return (
                  <Card
                    key={row.id}
                    className={cn('p-4', onRowClick && 'cursor-pointer')}
                    onClick={(event) => {
                      if (onRowClick) {
                        const isInteractiveElement = (event.target as HTMLElement).closest(
                          'a, button'
                        );
                        if (!isInteractiveElement) {
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
            <p className="mt-4 text-center text-muted-foreground">Data not found</p>
          )}
          {!isLoading && isUsePagination && table.getRowModel().rows?.length !== 0 && (
            <DataTablePagination table={table} />
          )}
        </div>
      )}
    </div>
  );
}
