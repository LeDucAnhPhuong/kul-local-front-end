import React, { useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import TitlePage from '@/components/ui/title-page';
import { useGetSlotsQuery } from '@/features/teacher/api.teacher';
import type { ScheduleItem, Slot } from '@/features/tedteam/slotInfo';
import { useGetScheduleDateRangeQuery, useGetSchedulesQuery } from '../api.schedule';
import { Button } from '@/components/ui/button';
import {
  Badge,
  Calendar,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  ListIcon,
  Plus,
  RotateCcw,
} from 'lucide-react';
import { Separator } from '@radix-ui/react-separator';
import { endOfDay, endOfMonth, endOfWeek, startOfDay, startOfMonth, startOfWeek } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { zoneTimeToUTC } from '@/utils/zone-time-to-utc';

function generateTimeSlotsCSSTrimmed(slots: { startTime: string; endTime: string }[]) {
  const allTimes: string[] = [];

  // Chuyển về phút từ 00:00
  function timeToMinutes(t: string) {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  }

  const sortedStart = Math.min(...slots.map((s) => timeToMinutes(s.startTime)));
  const sortedEnd = Math.max(...slots.map((s) => timeToMinutes(s.endTime)));

  // Thêm 1h trước slot 1 và sau slot 5
  const extraStart = Math.max(0, sortedStart - 60);
  const extraEnd = Math.min(24 * 60, sortedEnd + 60);

  for (let mins = extraStart; mins < extraEnd; mins += 15) {
    const hh = Math.floor(mins / 60)
      .toString()
      .padStart(2, '0');
    const mm = (mins % 60).toString().padStart(2, '0');
    allTimes.push(`${hh}:${mm}:00`);
  }

  const selectors = allTimes.map((t) => `.fc-timegrid-slot[data-time="${t}"]`).join(',\n');

  return `
    .fc-timegrid-slot {
      display: none;
    }

    ${selectors} {
      display: table-row !important;
    }
  `;
}

const ScheduleManagement = () => {
  const { slots } = useGetSlotsQuery(undefined, {
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

  // const { schedule } = useGetSchedulesQuery;

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage
        title="Manage Schedule"
        contentHref="Add schedule"
        href="/schedule-management/add"
      />
      <CustomSlotCalendar slots={slots} />
    </div>
  );
};

function getWeekDates(startStr: string): string[] {
  const start = new Date(startStr);

  const result = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    result.push(d.toISOString().split('T')[0]);
  }
  return result;
}

function colorFromId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 80%)`;
}

function generateScheduleEvents(schedules: ScheduleItem[], slots: Slot[]) {
  const slotMap = new Map(slots.map((slot) => [slot?.id, slot]));

  return schedules
    .map((sch) => {
      console.log('sch :>> ', sch);
      const slot = slotMap.get(sch.slot?.id);
      const dateStr = sch.date.split('T')[0];

      return {
        id: sch.id,
        title: `Class: ${sch.classInfor?.name} | Coach: ${sch.coach.firstName} ${sch.coach.lastName}`,
        start: `${dateStr}T${slot?.startTime}`,
        end: `${dateStr}T${slot?.endTime}`,
        backgroundColor: '#3f51b5',
        borderColor: '#3f51b5',
        editable: true,
        extendedProps: {
          scheduleId: sch.id,
          classId: sch.classInfor?.id,
          slotStart: slot?.startTime,
          slotEnd: slot?.endTime,
        },
      };
    })
    .filter(Boolean);
}

export function CustomSlotCalendar({ slots }: { slots: Slot[] }) {
  const customSlotCSS = generateTimeSlotsCSSTrimmed(slots);
  const calendarRef = React.useRef(null);
  const [selectedDate, setSelectedDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [currentView, setCurrentView] = React.useState('timeGridDay');
  const [events, setEvents] = React.useState<any>([]);

  const [{ startDate, endDate }, setCurrentDateRange] = React.useState({
    startDate: startOfDay(new Date()),
    endDate: endOfDay(new Date()),
  });

  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const { schedules } = useGetScheduleDateRangeQuery(
    {
      startDate: zoneTimeToUTC(startDate, localTimeZone).toISOString(),
      endDate: zoneTimeToUTC(endDate, localTimeZone).toISOString(),
    },
    {
      selectFromResult: ({ data }) => ({
        schedules: data?.data ?? [],
      }),
    },
  );

  const handleDatesSet = (arg: any) => {
    const newDate = arg.startStr.split('T')[0];
    setCurrentView(arg.view.type);

    switch (arg.view.type) {
      case 'timeGridDay':
        setSelectedDate(newDate);
        setCurrentDateRange({
          startDate: startOfDay(new Date(newDate)),
          endDate: endOfDay(new Date(newDate)),
        });
        break;
      case 'timeGridWeek':
        // Lấy ngày đầu tuần
        const weekStart = arg.view.currentStart;
        setSelectedDate(weekStart.toISOString().split('T')[0]);
        setCurrentDateRange({
          startDate: startOfWeek(weekStart),
          endDate: endOfWeek(weekStart),
        });
        break;
      case 'dayGridMonth':
        // Lấy ngày đầu tháng
        const monthStart = arg.view.currentStart;
        setSelectedDate(monthStart.toISOString().split('T')[0]);
        setCurrentDateRange({
          startDate: startOfMonth(monthStart),
          endDate: endOfMonth(monthStart),
        });
        break;
      case 'listWeek':
        // Lấy ngày đầu tuần
        const listWeekStart = arg.view.currentStart;
        setSelectedDate(listWeekStart.toISOString().split('T')[0]);
        setCurrentDateRange({
          startDate: startOfWeek(listWeekStart),
          endDate: endOfWeek(listWeekStart),
        });
        break;
    }

    setEvents([...generateScheduleEvents(schedules, slots)]);
    
  };

  // useEffect(() => {
  //   const calendarApi = (calendarRef?.current as any)?.getApi();
  //   if (calendarApi) {
  //     calendarApi.changeView(currentView, selectedDate);
  //     handleDatesSet({
  //       startStr: selectedDate,
  //       view: { type: currentView, currentStart: new Date(selectedDate) },
  //     });
  //   }
  // }, [selectedDate, currentView, slots, schedules]);

  const handleChangeView = (view: string) => {
    if (view === currentView) return; // tránh set lại không cần thiết
    const calendarApi = (calendarRef?.current as any)?.getApi();
    calendarApi.changeView(view);
    setCurrentView(view);
  };

  return (
    <>
      <style>{`
        /* Hide all slots by default */
        .fc-timegrid-slot {
          display: none;
        }

        ${customSlotCSS}
      `}</style>

      <div className="bg-white rounded-lg border shadow-sm p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button
              variant={
                selectedDate === new Date().toISOString().split('T')[0] ? 'secondary' : 'outline'
              }
              disabled={selectedDate === new Date().toISOString().split('T')[0]}
              onClick={() => (calendarRef.current as any)?.getApi().today()}
              className="gap-2 font-medium"
            >
              <RotateCcw className="h-4 w-4" />
              Today
            </Button>

            <Separator orientation="vertical" className="h-6" />

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => (calendarRef.current as any)?.getApi().prev()}
                className="px-3 hover:bg-gray-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => (calendarRef.current as any)?.getApi().next()}
                className="px-3 hover:bg-gray-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center">
              {currentView === 'timeGridDay' ? (
                <span className="text-sm text-gray-500">{selectedDate}</span>
              ) : currentView === 'timeGridWeek' || currentView === 'listWeek' ? (
                <span className="text-sm text-gray-500">
                  {startOfWeek(selectedDate).toLocaleDateString()} -{' '}
                  {endOfWeek(selectedDate).toLocaleDateString()}
                </span>
              ) : currentView === 'dayGridMonth' ? (
                <span className="text-sm text-gray-500">
                  {startOfMonth(selectedDate).toLocaleDateString()} -{' '}
                  {endOfMonth(selectedDate).toLocaleDateString()}
                </span>
              ) : null}
            </div>
          </div>

          {/* Right side - View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              variant={currentView === 'timeGridDay' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleChangeView('timeGridDay')}
              className="gap-2 rounded-md"
            >
              <CalendarDays className="h-4 w-4" />
              Day
            </Button>
            <Button
              variant={currentView === 'timeGridWeek' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleChangeView('timeGridWeek')}
              className="gap-2 rounded-md"
            >
              <Calendar className="h-4 w-4" />
              Week
            </Button>
            <Button
              variant={currentView === 'dayGridMonth' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleChangeView('dayGridMonth')}
              className="gap-2 rounded-md"
            >
              <Grid3X3 className="h-4 w-4" />
              Month
            </Button>
            <Button
              variant={currentView === 'listWeek' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleChangeView('listWeek')}
              className="gap-2 rounded-md"
            >
              <ListIcon className="h-4 w-4" />
              List
            </Button>
          </div>
        </div>
      </div>

      <FullCalendar
        ref={calendarRef}
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin, listPlugin]}
        initialView="timeGridDay"
        initialDate={selectedDate}
        events={events}
        slotDuration="00:30:00"
        slotLabelInterval="00:30:00"
        slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
        allDaySlot={false}
        scrollTime="06:00:00"
        datesSet={handleDatesSet}
        headerToolbar={false}
        height="auto"
      />
    </>
  );
}

export default ScheduleManagement;
