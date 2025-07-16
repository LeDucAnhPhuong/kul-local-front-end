import type React from 'react';
import type { RegisterSlotSchedule, DayKey } from '../slotInfo';
import { getRegisterStatus } from '../teddata';
import { Spinner } from '@/components/ui/spinner';
import { formatDate } from 'date-fns';
import { StatusButton } from './register-schedule-columns';

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
  data: RegisterSlotSchedule[];
  isLoading?: boolean;
};

export const RegisterMobileView: React.FC<Props> = ({ data, isLoading }) => {
  const dayKeys: DayKey[] = ['t2', 't3', 't4', 't5', 't6', 't7', 'cn'];

  return isLoading ? (
    <div className="w-full flex justify-center items-center h-full">
      <Spinner />
    </div>
  ) : (
    <div className="block space-y-4 md:hidden">
      {dayKeys?.map((dayKey) => {
        const slotsWithDay = data
          .map((slot, slotIndex) => ({
            slotName: slot.slot,
            slotIndex,
            cell: slot[dayKey],
          }))
          .filter((item) => item.cell);

        if (slotsWithDay.length === 0) return null;

        return (
          <div key={dayKey} className="p-3 bg-white shadow rounded-xl">
            <h3 className="mb-2 text-lg font-bold text-blue-600">{dayHeaderMap[dayKey]}</h3>
            {slotsWithDay.map(({ slotName, slotIndex, cell }, idx) => (
              <div
                key={`${slotIndex}-${idx}`}
                className="pb-2 mb-2 border-b last:border-none last:mb-0"
              >
                <div className="text-sm font-medium text-gray-800 mb-1">{slotName}</div>
                <div className="mt-1 text-xs font-medium text-green-600">
                  {cell?.schedule?.slot?.startTime} - {cell?.schedule?.slot?.endTime}
                </div>
                <div className="text-xs font-medium text-blue-600 mb-2">
                  {formatDate(cell?.schedule?.date || '', 'dd-MM-yyyy')}
                </div>
                <StatusButton
                  status={getRegisterStatus(cell!.status)}
                  scheduleId={cell?.schedule?.id}
                />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};
