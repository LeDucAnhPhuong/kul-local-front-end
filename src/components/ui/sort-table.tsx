import { type ReactNode } from 'react';
import { ArrowDownNarrowWide, ArrowUpDown, ArrowUpNarrowWide } from 'lucide-react';
import { flexRender, type Table } from '@tanstack/react-table';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

function SortModal({ opener, table }: { opener: ReactNode; table: Table<any> }) {
  'use no memo';

  return (
    <Dialog>
      <DialogTrigger asChild>{opener}</DialogTrigger>
      <DialogContent className="flex h-[80vh] flex-col sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sort for</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow">
          {table.getHeaderGroups().map((headerEl) => {
            return (
              <div key={headerEl.id} className="grid gap-4">
                {headerEl.headers
                  .filter((header) => header.column.getCanSort())
                  .map((columnEl) => {
                    return (
                      <Button
                        key={columnEl.id}
                        className="justify-between w-full font-normal"
                        variant="ghost"
                        onClick={columnEl.column.getToggleSortingHandler()}
                      >
                        <span className="font-medium">
                          {flexRender(columnEl.column.columnDef.header, columnEl.getContext())}
                        </span>
                        {!columnEl.column.getIsSorted() && <ArrowUpDown className="w-4 h-4 ml-2" />}
                        {columnEl.column.getIsSorted() === 'asc' && (
                          <ArrowUpNarrowWide className="w-4 h-4 ml-2" />
                        )}
                        {columnEl.column.getIsSorted() === 'desc' && (
                          <ArrowDownNarrowWide className="w-4 h-4 ml-2" />
                        )}
                      </Button>
                    );
                  })}
              </div>
            );
          })}
        </ScrollArea>

        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SortModal;
