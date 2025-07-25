import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import type { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between px-2">
      {/* <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} {"row(s) selected"}.
      </div> */}
      <div className="flex items-center space-x-6 lg:space-x-8 justify-between w-full">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              className="hidden h-8 w-8 p-0 lg:flex"
              disabled={!table.getCanPreviousPage()}
              variant="outline"
              onClick={() => table.setPageIndex(0)}
            >
              <span className="sr-only">{'Go to first page'}</span>
              <DoubleArrowLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              className="h-8 w-8 p-0"
              disabled={!table.getCanPreviousPage()}
              variant="outline"
              onClick={() => table.previousPage()}
            >
              <span className="sr-only">{'Go to previous page'}</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              className="h-8 w-8 p-0"
              disabled={!table.getCanNextPage()}
              variant="outline"
              onClick={() => {
                table.nextPage();
              }}
            >
              <span className="sr-only">{'Go to next page'}</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              className="hidden h-8 w-8 p-0 lg:flex"
              disabled={!table.getCanNextPage()}
              variant="outline"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            >
              <span className="sr-only">{'Go to last page'}</span>
              <DoubleArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
