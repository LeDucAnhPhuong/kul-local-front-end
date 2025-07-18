import React, { useMemo, useState } from 'react';
import {  transformAttendanceData } from '../teddata';
import { personalWorkColumns } from '../columns/personal-schedule';
import { PersonalScheduleMobileView } from '../columns/personal-mobile';
import { TedDataTable } from './ted-data';
import { useGetAllSlotQuery, useGetTedTeamScheduleByDateRangeQuery } from '../api.tedteam';
import type { Slot } from '../slotInfo';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

export default function PersonalSchedule() {
  const [isMobile, setIsMobile] = React.useState(false);

  const weekOptions = useMemo(() => generateWeekOptions(), []);
  const todayMonday = getMonday(new Date()).toISOString().split('T')[0];

  const [selectedWeek, setSelectedWeek] = useState(() => {
    const match = weekOptions.find((w) => w.value === todayMonday);
    return match ? match.value : weekOptions[0]?.value || '';
  });
  const { data, isFetching } = useGetTedTeamScheduleByDateRangeQuery({
    startDate: new Date(selectedWeek).toISOString(),
    endDate: getSunday(new Date(selectedWeek)).toISOString(),
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

  const scheduleData = transformAttendanceData(data?.data || [], slots ?? []);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="bg-white dark:bg-background p-6 rounded-xl border border-stone-200 dark:border-stone-800">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Personal Work Schedule</h2>
        <p className="text-muted-foreground">
          Your approved work shifts and attendance tracking. Please arrive on time for your
          scheduled shifts.
        </p>
      </div>
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

      {isMobile ? (
        <PersonalScheduleMobileView data={scheduleData} />
      ) : (
        <TedDataTable
          data={scheduleData}
          columns={personalWorkColumns}
          isLoading={isFetching}
          onRowClick={() => {}}
        />
      )}

      <div className="mt-4 text-sm text-muted-foreground">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span>Not Yet</span>
          </div>
        </div>
      </div>
    </div>
  );
}
