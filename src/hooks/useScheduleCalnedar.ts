'use client';

import {
  useGetScheduleDateRangeQuery,
  useGetSchedulesQuery,
} from '@/features/schedule-management/api.schedule';
import type { Slot } from '@/features/schedule-management/data.type';
import { useGetAllSlotQuery } from '@/features/tedteam/api.tedteam';
import { zoneTimeToUTC } from '@/utils/zone-time-to-utc';

export function useCalendarData({ startDate, endDate }: { startDate?: Date; endDate?: Date } = {}) {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const { slots, isLoadingSlots } = useGetAllSlotQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => ({
      slots: data?.data
        ? (Array.from(data?.data) as Slot[])?.sort((a: Slot, b: Slot) => {
            const toMinutes = (time: string) => {
              const [h, m] = time.split(':').map(Number);
              return h * 60 + m;
            };
            return toMinutes(a.startTime) - toMinutes(b.startTime);
          })
        : [],
      isLoadingSlots: isFetching,
    }),
  });

  const { schedules, isLoadingSchedules } = useGetScheduleDateRangeQuery(
    {
      startDate: zoneTimeToUTC(startDate || new Date(), timeZone).toISOString(),
      endDate: zoneTimeToUTC(endDate || new Date(), timeZone).toISOString(),
    },
    {
      selectFromResult: ({ data, isFetching }) => ({
        schedules: data?.data || [],
        isLoadingSchedules: isFetching,
      }),
    },
  );

  const loading = isLoadingSlots || isLoadingSchedules;

  return { slots, schedules, loading };
}
