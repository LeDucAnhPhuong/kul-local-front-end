'use client';

import { useMemo, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import TitlePage from '@/components/ui/title-page';
import DataTable from '@/components/data-table/data-table';
import DataCard from '@/components/ui/data-card';
import { convertToMobileSchedule } from '../columns/convertToMobileSchedule';
import { convertToSlotByDay } from '../columns/convertToSlotByDay';
import { columns as desktopColumns } from '../columns/schedule.columns';
import { columns as mobileColumns } from '../columns/schedule.columnsmobile';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useGetTeacherScheduleQuery, useGetSlotsQuery } from '../api.teacher';

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
  const start = getMonday(new Date(2010, 0, 1));
  const end = new Date(2030, 11, 31);
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

function TeacherView() {
  const weekOptions = useMemo(() => generateWeekOptions(), []);
  const todayMonday = getMonday(new Date()).toISOString().split('T')[0];

  const [selectedWeek, setSelectedWeek] = useState(() => {
    const match = weekOptions.find((w) => w.value === todayMonday);
    return match ? match.value : weekOptions[0]?.value || '';
  });

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

  const { slot = [], isFetching_slot } = useGetSlotsQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => ({
      slot: data || [],
      isFetching_slot: isFetching,
    }),
  });

  const { week = [], isFetching } = useGetTeacherScheduleQuery(
    selectedWeek
      ? {
          startDate: new Date(selectedWeek).toISOString(),
          endDate: getSunday(new Date(selectedWeek)).toISOString(),
        }
      : { startDate: '', endDate: '' },
    {
      skip: !selectedWeek,
      selectFromResult: ({ data, isFetching }) => ({
        week: data?.data || [],
        isFetching,
      }),
    },
  );

  // Truyền danh sách tất cả slot vào hàm convertToSlotByDay
  const deskdata = useMemo(() => {
    if (!week || !slot) return [];
    return convertToSlotByDay(week, slot);
  }, [week, slot]);
  const mobiledata = useMemo(() => {
    if (!week || !slot) return [];
    return convertToMobileSchedule(week, slot);
  }, [week, slot]);

  return (
    <>
      <div className="bg-white dark:bg-background p-4 rounded-xl border border-stone-200 dark:border-stone-800">
        <TitlePage title="Teacher Schedule" />
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
              disabled={currentIndex >= weekOptions.length - 1}
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

        <div className="lg:hidden block px-4">
          <DataCard
            isUsePagination={false}
            isUseToolbar={false}
            data={mobiledata}
            columns={mobileColumns}
            isLoading={isFetching || isFetching_slot}
          />
        </div>

        <div className="hidden lg:block">
          <DataTable
            isUsePagination={false}
            isUseToolbar={false}
            data={deskdata}
            columns={desktopColumns}
            isLoading={isFetching || isFetching_slot}
          />
        </div>
      </div>
    </>
  );
}

export default TeacherView;
