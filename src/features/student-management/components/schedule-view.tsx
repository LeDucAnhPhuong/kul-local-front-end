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
import { columns, type SlotSchedule } from '../columns/schedule';
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
  const current = new Date(start);

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

  const { slots } = useGetAllSlotQuery(undefined, {
    selectFromResult: ({ data }) => ({
      slots: data?.data
        ? (Array.from(data?.data) as Slot[])?.sort((a: Slot, b: Slot) => {
            const toMinutes = (time: string) => {
              const [h, m] = time.split(':').map(Number);
              return h * 60 + m;
            };
            return toMinutes(a.startTime) - toMinutes(b.startTime);
          })
        : [],
    }),
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

  // Transform API data with proper error handling
  const scheduleData = useMemo<SlotSchedule[]>(() => {
    try {
      console.log('Raw API data:', week);
      const transformed = transformAttendanceData(week || [], slots) as SlotSchedule[];
      console.log('Transformed data:', transformed);
      return transformed;
    } catch (err) {
      console.error('Error transforming attendance data:', err);
      return transformAttendanceData([], slots) as SlotSchedule[]; // Return empty slots structure
    }
  }, [week, slots]);

  // Navigation logic
  const currentIndex = weekOptions.findIndex((w) => w.value === selectedWeek);

  const goToPreviousWeek = () => {
    if (currentIndex > 0) {
      setSelectedWeek(weekOptions[currentIndex - 1].value);
    }
  };

  const goToNextWeek = () => {
    if (currentIndex < weekOptions.length - 1) {
      setSelectedWeek(weekOptions[currentIndex + 1].value);
    }
  };

  const isMobile = useMediaQuery('(max-width: 1440px)');

  return (
    <div className="p-4 bg-white border dark:bg-background rounded-xl border-stone-200 dark:border-stone-800">
      <TitlePage title="Student Schedule" />
      <p className="mb-2 text-sm text-gray-500">Select a week:</p>

      {/* Week Navigation */}
      <div className="flex flex-wrap items-center justify-start gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousWeek}
            disabled={currentIndex <= 0}
            className="h-10 px-3"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="w-[250px]">
            <Select value={selectedWeek} onValueChange={setSelectedWeek}>
              <SelectTrigger className="flex items-center justify-between w-full h-10 px-3 py-2 text-sm">
                <SelectValue placeholder="Select week" className="flex-1 text-center" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-auto">
                {weekOptions.map((week) => (
                  <SelectItem
                    key={week.value}
                    value={week.value}
                    className="justify-center text-center"
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
            disabled={currentIndex >= weekOptions.length - 1}
            className="h-10 px-3"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-3 mb-4 border border-red-200 rounded-md bg-red-50">
          <p className="text-sm text-red-600">
            Error loading schedule. Please try selecting a different week.
          </p>
        </div>
      )}

      {/* Always show the table structure, with loading state only affecting the data */}
      {isMobile ? (
        <MobileScheduleView data={scheduleData} />
      ) : (
        <div className="relative">
          {/* Loading overlay */}
          {isFetching && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-md bg-white/50">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 mb-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
                <p className="text-sm text-gray-500">Loading...</p>
              </div>
            </div>
          )}
          <DataTable
            data={scheduleData}
            columns={columns}
            isLoading={false} // Don't use table's loading state to prevent structure changes
            isUsePagination={false}
            isUseToolbar={false}
          />
        </div>
      )}
    </div>
  );
};

export default ScheduleUI;
