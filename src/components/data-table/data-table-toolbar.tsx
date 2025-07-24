import { Cross2Icon } from '@radix-ui/react-icons';
import type { Table } from '@tanstack/react-table';

import { Label } from '../ui/label';

import { DataTableViewOptions } from './data-table-view-options';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-end flex-1 space-x-4 ">
        <div className="flex flex-col w-60">
          <Label className="block mb-1 text-sm" htmlFor="search ">
            Search
          </Label>
          <Input
            className="h-8"
            id="search"
            placeholder="Enter search..."
            value={table.getState().globalFilter ?? ''}
            onChange={(e) => table.setGlobalFilter(e.target.value)}
            // value={
            //   (table.getColumn("userName")?.getFilterValue() as string) ?? ""
            // }
            // onChange={(event) =>
            //   table.getColumn("userName")?.setFilterValue(event.target.value)
            // }
          />
        </div>
        {/* <div className="flex flex-col">
          <Label
            className="block mb-1 text-sm"
            htmlFor={table.getColumn("status")?.id}
          >
            Lọc trạng thái
          </Label>
          {table.getColumn("status") && (
            <DataTableFacetedFilter
              column={table.getColumn("status")}
              id={table.getColumn("status")?.id}
              options={usersStatus}
              title={"Trạng thái"}
            />
          )}
        </div>

        <div className="flex flex-col">
          <Label
            className="block mb-1 text-sm"
            htmlFor={table.getColumn("role")?.id}
          >
            Lọc quyền
          </Label>
          {table.getColumn("status") && (
            <DataTableFacetedFilter
              column={table.getColumn("role")}
              id={table.getColumn("role")?.id}
              options={usersRole}
              title={"Quyền"}
            />
          )}
        </div> */}

        {isFiltered && (
          <Button
            className="h-8 px-2 lg:px-3"
            variant="outline"
            onClick={() => table.resetColumnFilters()}
          >
            <Cross2Icon className="w-4 h-4 " />

            {'Xoá bộ lọc'}
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
