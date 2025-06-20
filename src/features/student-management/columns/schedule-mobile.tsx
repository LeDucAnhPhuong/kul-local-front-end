import React from 'react';
import type { SlotSchedule, DayKey } from './schedule';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Hourglass } from 'lucide-react';

const dayHeaderMap: Record<DayKey, string> = {
  t2: 'Monday',
  t3: 'Tuesday', 
  t4: 'Wednesday',
  t5: 'Thursday',
  t6: 'Friday',
  t7: 'Saturday',
  cn: 'Sunday',
};

type Props = {
  data: SlotSchedule[];
};

export const MobileScheduleView: React.FC<Props> = ({ data }) => {
  const dayKeys: DayKey[] = ['t2', 't3', 't4', 't5', 't6', 't7', 'cn'];

  return (
    <div className="space-y-4">
      {dayKeys.map((dayKey) => {
        const slotsWithDay = data
          .map((slot) => ({ slotName: slot.slot, cell: slot[dayKey] }))
          .filter((item) => item.cell);

        if (slotsWithDay.length === 0) return null;

        return (
          <div key={dayKey} className="p-3 bg-white shadow rounded-xl dark:bg-gray-800">
            <h3 className="mb-2 text-lg font-bold text-blue-600 dark:text-blue-400">
              {dayHeaderMap[dayKey]} | {slotsWithDay[0].cell!.date}
            </h3>

            {slotsWithDay.map(({ slotName, cell }, idx) => (
              <div key={idx} className="pb-2 mb-2 border-b last:border-none last:mb-0 dark:border-gray-700">
                {/* Slot Name */}
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {slotName}:  {cell!.roomName}
                </div>
                
                {/* Room and Class Info */}
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Room {cell!.room_id} | Class {cell!.class_id}
                </div>

                 {/* Coach */}
                <div className="text-xs text-muted-foreground">
                  Coach: {cell!.coach_id}
                </div>

                {/* Status Badge */}
                <Badge
                  className={cn(
                    'text-xs px-2 py-1 w-fit mt-1',
                    cell!.status === 'not yet'
                      ? 'bg-orange-500 hover:bg-orange-600'
                      : cell!.status === 'absent'
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-green-500 hover:bg-green-600'
                  )}
                >
                  {cell!.status === 'not yet' 
                    ? 'Not Yet' 
                    : cell!.status === 'absent' 
                    ? 'Absent' 
                    : 'Present'}
                </Badge>

                {/* Time */}
                <div className="flex items-center gap-1 mt-1.5 text-xs font-medium leading-tight text-green-600">
                    <Hourglass className='inline-block mr-1 size-3 bg-clip-padding'/>{cell!.time}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};