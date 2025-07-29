'use client';

import { useGetCoachesQuery } from '@/features/account-management/api.user';
import type { User } from '@/features/account-management/columns/account-management';
import type { Class } from '@/features/class-management/columns/class-management';
import { useGetRoomsQuery } from '@/features/schedule-management/api.room';
import type { Room, Slot } from '@/features/schedule-management/data.type';
import { useGetAllSlotQuery, useGetClassesQuery } from '@/features/tedteam/api.tedteam';

export function useScheduleData() {
  const { slots, isFetching_slots } = useGetAllSlotQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => ({
      slots: data?.data
        ? (Array.from(data?.data?.filter((item: Slot) => item?.isActive)) as Slot[])?.sort(
            (a: Slot, b: Slot) => {
              const toMinutes = (time: string) => {
                const [h, m] = time.split(':').map(Number);
                return h * 60 + m;
              };
              return toMinutes(a.startTime) - toMinutes(b.startTime);
            },
          )
        : [],
      isFetching_slots: isFetching,
    }),
  });

  const { roomList: rooms, isFetching_rooms } = useGetRoomsQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => ({
      roomList: data?.data?.filter((item: Room) => item?.isActive) || [],
      isFetching_rooms: isFetching,
    }),
  });

  const { classList: classes, isFetching_classes } = useGetClassesQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => ({
      classList: data?.data?.filter((item: Class) => item?.isActive) || [],
      isFetching_classes: isFetching,
    }),
  });

  const { coaches, isFetching_coaches } = useGetCoachesQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => ({
      coaches: data?.data?.filter((item: User) => item?.isActive) || [],
      isFetching_coaches: isFetching,
    }),
  });

  const loading = isFetching_slots || isFetching_rooms || isFetching_classes || isFetching_coaches;

  return { slots, rooms, classes, coaches, loading };
}
