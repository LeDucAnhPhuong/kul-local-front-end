'use client';

import { useMemo, useState } from 'react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import TitlePage from '@/components/ui/title-page';
import { useMediaQuery } from 'usehooks-ts';
import { MobileScheduleView } from '../columns/schedule-mobile';
import DataTable from '@/components/data-table/data-table';
import { columns, type APIAttendanceData, type SlotSchedule } from '../columns/schedule';
import { useGetScheduleByWeekQuery } from '../api.student';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useGetAllSlotQuery } from '@/features/tedteam/api.tedteam';
import type { Slot, UserSchedule } from '@/features/tedteam/slotInfo';
import { transformAttendanceData } from '@/features/tedteam/teddata';

// === Utils ===
const getMonday = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getSunday = (monday: Date) => {
  const d = new Date(monday);
  d.setDate(d.getDate() + 6);
  return d;
};

const formatDate = (date: Date) =>
  date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

const generateWeekOptions = () => {
  const weeks = [];
  const start = getMonday(new Date(2000, 0, 1));
  const end = new Date(2050, 11, 31);
  let current = new Date(start);

  while (current <= end) {
    const monday = getMonday(current);
    const sunday = getSunday(monday);
    weeks.push({
      value: monday.toISOString().split('T')[0],
      label: `${formatDate(monday)} - ${formatDate(sunday)}`,
    });
    current.setDate(current.getDate() + 7);
  }

  return weeks;
};

const ScheduleUI = () => {
  const weekOptions = useMemo(() => generateWeekOptions(), []);
  const todayMonday = getMonday(new Date()).toISOString().split('T')[0];

  const [selectedWeek, setSelectedWeek] = useState(() => {
    const match = weekOptions.find((w) => w.value === todayMonday);
    return match ? match.value : weekOptions[0]?.value || '';
  });

  // API call with proper typing
  const { week, isFetching, error } = useGetScheduleByWeekQuery(
    {
      startDate: new Date(selectedWeek).toISOString(),
      endDate: getSunday(new Date(selectedWeek)).toISOString(),
    },
    {
      selectFromResult: ({ data, isFetching, error }) => ({
        week: (data?.data as UserSchedule[]) || [],
        isFetching,
        error,
      }),
    },
  );

  const { slots } = useGetAllSlotQuery(undefined, {
    selectFromResult: ({ data }) => ({
      slots: data
        ? (Array.from(data) as Slot[])?.sort((a: Slot, b: Slot) => {
            const toMinutes = (time: string) => {
              const [h, m] = time.split(':').map(Number);
              return h * 60 + m;
            };
            return toMinutes(a.startTime) - toMinutes(b.startTime);
          })
        : [],
    }),
  });

  // Transform API data with proper error handling
  const scheduleData = useMemo(() => {
    if (week && Array.isArray(week) && week?.length > 0) {
      try {
        return transformAttendanceData(week, slots ?? []);
      } catch (err) {
        console.error('Error transforming attendance data:', err); // Return empty slots structure
      }
    }
    return [];
  }, [week]);

  const currentIndex = weekOptions.findIndex((w) => w.value === selectedWeek);

  const goToPreviousWeek = () => {
    if (currentIndex > 0) {
      setSelectedWeek(weekOptions[currentIndex - 1].value);
    }
  };

  const goToNextWeek = () => {
    if (currentIndex < weekOptions?.length - 1) {
      setSelectedWeek(weekOptions[currentIndex + 1].value);
    }
  };

  const isMobile = useMediaQuery('(max-width: 1440px)');

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border border-stone-200 dark:border-stone-800">
      <TitlePage title="Student Schedule" />
      <p className="mb-2 text-sm text-gray-500">Select a week:</p>

      <div className="flex flex-wrap gap-2 justify-start items-center mb-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousWeek}
            disabled={currentIndex <= 0}
          >
            <ChevronLeft />
          </Button>

          <div className="w-[200px]">
            <Select value={selectedWeek} onValueChange={setSelectedWeek}>
              <SelectTrigger className="w-full px-3 py-2 text-sm">
                <SelectValue placeholder="Select week" className="text-center" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-auto">
                {weekOptions.map((week) => (
                  <SelectItem
                    key={week.value}
                    value={week.value}
                    className="text-center justify-center"
                  >
                    {week.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={goToNextWeek}
            disabled={currentIndex >= weekOptions?.length - 1}
          >
            <ChevronRight />
          </Button>
        </div>
        <div>
          <Button
            variant="outline"
            size="sm"
            disabled={selectedWeek === todayMonday}
            onClick={() => setSelectedWeek(todayMonday)}
          >
            Today
          </Button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">
            Error loading schedule. Please try selecting a different week.
          </p>
        </div>
      )}

      {/* Always show the table structure, with loading state only affecting the data */}
      {isMobile ? (
        <MobileScheduleView data={scheduleData as SlotSchedule[]} />
      ) : (
        <div className="relative">
          {/* Loading overlay */}
          {isFetching && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-md">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mb-2"></div>
                <p className="text-sm text-gray-500">Loading...</p>
              </div>
            </div>
          )}
          <DataTable
            data={scheduleData as SlotSchedule[]}
            columns={columns}
            isLoading={false}
            isUsePagination={false}
            isUseToolbar={false}
          />
        </div>
      )}
    </div>
  );
};

export default ScheduleUI;
