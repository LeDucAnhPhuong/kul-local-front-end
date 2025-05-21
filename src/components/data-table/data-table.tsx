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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  onRowClick?: ({ data }: { data: TData }) => void;
}

export const LoadingTable = ({ length }: { length: number }) => (
  <TableRow>
    <TableCell className="h-24 text-center" colSpan={length}>
      <div className="flex items-center justify-center">
        <svg
          className="animate-spin h-5 w-5 mr-3 text-primary"
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
        đang tải...
      </div>
    </TableCell>
  </TableRow>
);

export default function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  'use no memo';

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
    <div className="">
      <div className="lg:block hidden space-y-4">
        {!isLoading && <DataTableToolbar table={table} />}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        <DataTableColumnHeader
                          column={header.column}
                          title={header.column.columnDef.header as string}
                        />
                      </TableHead>
                    );
                  })}
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
                    {'No data results'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {!isLoading && <DataTablePagination table={table} />}
      </div>
      <div className="block lg:hidden">
        <div>
          <div className="mb-4 flex items-end justify-between gap-4">
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
                    <Filter className="h-4 w-4" />
                  </Button>
                }
                table={table}
              />
              <SortModal
                opener={
                  <Button variant={sorting?.length ? 'default' : 'secondary'}>
                    <ArrowDownUp className="h-4 w-4" />
                  </Button>
                }
                table={table}
              />
            </div>
          </div>
          {isLoading ? (
            <div className="flex w-full items-center justify-center py-10">
              <Spinner className="size-24" color="primary" />
            </div>
          ) : table?.getRowModel()?.rows?.length ? (
            <div className="grid mb-8 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {table?.getRowModel()?.rows?.map((row) => {
                const record = row.original;

                return (
                  <Card
                    key={row.id}
                    className={cn('p-4', onRowClick && 'cursor-pointer')}
                    onClick={(event) => {
                      if (onRowClick) {
                        const isInteractiveElement = (event.target as HTMLElement).closest(
                          'a, button',
                        );

                        if (!isInteractiveElement) {
                          onRowClick({
                            data: record,
                          });
                        }
                      }
                    }}
                  >
                    <div className="space-y-2 h-full flex flex-col justify-between">
                      {row?.getVisibleCells()?.map((cell) => {
                        return (
                          <div key={cell.id} className="flex justify-between ">
                            {typeof cell.column.columnDef.header === 'string' && (
                              <div className="flex-1 text-base font-bold">
                                {cell.column.columnDef.header} :
                              </div>
                            )}
                            <div className="flex flex-1 justify-end text-end text-base">
                              {flexRender(cell?.column?.columnDef?.cell, cell?.getContext())}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-muted-foreground mt-4">Không tìm thấy dữ liệu</p>
          )}
          {!isLoading && table?.getRowModel()?.rows?.length !== 0 && (
            <DataTablePagination table={table} />
          )}
        </div>
      </div>
    </div>
  );
}
