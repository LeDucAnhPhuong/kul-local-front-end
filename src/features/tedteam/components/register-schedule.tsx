import { useState, useEffect } from 'react';

import { transformRegisterScheduleData } from '../teddata';
import { columns } from '../columns/register-schedule-columns';
import { RegisterMobileView } from '../columns/register-mobile';
import type { Slot } from '../slotInfo';
import { useGetAllSlotQuery, useGetRegisterScheduleQuery } from '../api.tedteam';
import DataTable from '@/components/data-table/data-table';

export default function RegisterSchedule() {
  const [isMobile, setIsMobile] = useState(false);

  const { register, isFetching } = useGetRegisterScheduleQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => ({
      register: data?.data || [],
      isFetching,
    }),
  });

  const { slots } = useGetAllSlotQuery(undefined, {
    selectFromResult: ({ data }) => ({
      slots: data?.data
        ? (Array.from(data?.data) as Slot[])?.sort((a: Slot, b: Slot) => {
            const toMinutes = (time: string) => {
              const [h, m] = time.split(':').map(Number);
              return h * 60 + m;
            };
            return toMinutes(a?.startTime) - toMinutes(b?.startTime);
          })
        : [],
    }),
  });

  const data = transformRegisterScheduleData(register, slots);
  console.log('data', data);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="bg-white dark:bg-background p-6 rounded-xl border border-stone-200 dark:border-stone-800">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Work Schedule Registration</h2>
        <p className="text-muted-foreground">
          Click status buttons to register or unregister for work shifts.
        </p>
      </div>

      {isMobile ? (
        <RegisterMobileView data={data} isLoading={isFetching} />
      ) : (
        <DataTable
          columns={columns}
          isLoading={isFetching}
          data={data}
          isUsePagination={false}
          isUseToolbar={false}
        />
      )}

      <div className="mt-4 text-sm text-muted-foreground">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Register</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Registered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Unregistered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded"></div>
            <span>Full</span>
          </div>
        </div>
        <div className="mt-2 text-xs">
          Time slots:{' '}
          {slots.map((slot: Slot, index: number) => (
            <span key={slot.id} className="mr-2">
              {slot.name} ({slot.startTime} - {slot.endTime}) {index !== slots.length - 1 && '|'}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
