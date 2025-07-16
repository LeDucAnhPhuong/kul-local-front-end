import type { ColumnDef } from '@tanstack/react-table';
import type { ScheduleItem } from '../types/schedule';
import { CalendarDays, MapPin } from 'lucide-react';

type MobileRow = {
  date: string;
  dayName: string;
  slots: (ScheduleItem & { isEmpty?: boolean })[];
};

export const columns: ColumnDef<MobileRow>[] = [
  {
    accessorKey: 'date',
    cell: ({ row }) => (
      <div className="space-y-3">
        <div className="border-b pb-2 mb-3">
          <div className="font-semibold text-lg text-blue-600">{row.original.dayName}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {row.original.date.split(' ').slice(1).join(' ')}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'slots',
    cell: ({ row }) => (
      <div className="flex-1 w-full">
        <div className="space-y-3 px-3 !flex-1 basis-0 w-full min-w-0 ">
          {row.original.slots.map((slot, index) => (
            <div
              key={slot._id || `slot-${index}`}
              className={`pt-3 !flex-1 rounded-lg border p-2 ${
                slot.isEmpty
                  ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
              }`}
            >
              <div className="flex justify-between mb-2 items-start w-full ">
                <div className=" font-semibold text-sm capitalize text-gray-700 dark:text-gray-300">
                  {slot.slot?.name || 'Unknown Slot'}
                </div>
                <div>
                  {slot.isEmpty ? (
                    <div className="text-center py-2">
                      <div className="text-gray-400 text-sm">-</div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-blue-600 dark:text-blue-400 font-medium">
                        {slot.classInfo?.name}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-emerald-600">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {slot.slot?.startTime} - {slot.slot?.endTime}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>
                          {slot.room?.name} | {slot.room?.location}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export type { MobileRow };
