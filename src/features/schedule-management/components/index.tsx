import { useCallback, useState } from 'react';
import type { Schedule, ViewMode } from '../data.type';
import { endOfWeek, formatDate, startOfWeek } from 'date-fns';
import {
  DayView,
  getWeekDays,
  MonthView,
  WeekListView,
  WeekView,
} from '@/components/ui/schedule-canlendar';
import { Calendar, ChevronLeft, ChevronRight, Clock, Grid3X3, List, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { useCalendarData } from '@/hooks/useScheduleCalnedar';
import { useDeleteScheduleMutation, useUpdateScheduleMutation } from '../api.schedule';
import TitlePage from '@/components/ui/title-page';
import { zoneTimeToUTC } from '@/utils/zone-time-to-utc';
import { toast } from 'sonner';

export function getDateRange(
  viewMode: ViewMode,
  currentDate: Date,
): { startDate: Date; endDate: Date } {
  const date = new Date(currentDate);
  let startDate: Date;
  let endDate: Date;

  switch (viewMode) {
    case 'day':
      startDate = new Date(date.setHours(0, 0, 0, 0));
      endDate = new Date(date.setHours(23, 59, 59, 999));
      break;
    case 'week':
    case 'weekList': {
      startDate = startOfWeek(currentDate, { weekStartsOn: 1 });

      endDate = endOfWeek(currentDate, { weekStartsOn: 1 });
      break;
    }
    case 'month': {
      startDate = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
      endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
      break;
    }
    default:
      startDate = new Date(date.setHours(0, 0, 0, 0));
      endDate = new Date(date.setHours(23, 59, 59, 999));
      break;
  }

  return { startDate, endDate };
}

export default function CustomCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [draggedSchedule, setDraggedSchedule] = useState<Schedule | null>(null);

  const [deleteSchedule] = useDeleteScheduleMutation();

  const { startDate, endDate } = getDateRange(viewMode, currentDate);
  const { slots, schedules, loading } = useCalendarData({ startDate, endDate });
  const [updateSchedules] = useUpdateScheduleMutation();

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    switch (viewMode) {
      case 'day':
        newDate.setDate(newDate.getDate() - 1);
        break;
      case 'week':
      case 'weekList':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    switch (viewMode) {
      case 'day':
        newDate.setDate(newDate.getDate() + 1);
        break;
      case 'week':
      case 'weekList':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDragStart = useCallback((schedule: Schedule) => {
    setDraggedSchedule(schedule);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedSchedule(null);
  }, []);

  const handleDelete = async (data: Schedule) => {
    const toastId = toast.loading('Deleting schedule...');
    try {
      await deleteSchedule(data?.id).unwrap();
      toast.success('Schedule deleted successfully', { id: toastId });
    } catch {
      toast.error('Failed to delete schedule', { id: toastId });
    }
  };

  const handleDrop = useCallback(
    async (date: Date, slotId?: string) => {
      if (!draggedSchedule) return;

      const newDate = date;
      newDate.setHours(0, 0, 0, 0);
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      try {
        await updateSchedules({
          id: draggedSchedule.id,
          date: zoneTimeToUTC(newDate, timeZone).toISOString(),
          slotId: slotId || draggedSchedule.slotId,
        }).unwrap();
      } catch (error) {
        console.error('Error updating schedule:', error);
      }

      // setSchedules((prev: Schedule[]) =>
      //   prev.map((schedule) =>
      //     schedule.id === draggedSchedule.id ? { ...schedule, date: newDate, slotId } : schedule,
      //   ),
      // );

      setDraggedSchedule(null);
    },
    [draggedSchedule],
  );

  const getViewTitle = () => {
    switch (viewMode) {
      case 'day':
        return formatDate(currentDate, 'dd MMMM yyyy');
      case 'week':
      case 'weekList':
        const weekStart = getWeekDays(currentDate)[0];
        const weekEnd = getWeekDays(currentDate)[6];
        return `${weekStart.getDate()} - ${weekEnd.getDate()} ${currentDate.toLocaleDateString(
          'en-US',
          { month: 'long', year: 'numeric' },
        )}`;
      case 'month':
        return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      default:
        return '';
    }
  };

  const renderView = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      );
    }

    const commonProps = {
      currentDate,
      schedules,
      onDragStart: handleDragStart,
      onDragEnd: handleDragEnd,
      onDrop: handleDrop,
    };

    switch (viewMode) {
      case 'day':
        return <DayView {...commonProps} slots={slots} onDelete={handleDelete} />;
      case 'week':
        return <WeekView {...commonProps} slots={slots} onDelete={handleDelete} />;
      case 'month':
        return <MonthView {...commonProps} onDelete={handleDelete} />;
      case 'weekList':
        return <WeekListView {...commonProps} onDelete={handleDelete} />;
      default:
        return <WeekView {...commonProps} slots={slots} onDelete={handleDelete} />;
    }
  };

  return (
    <div className="h-screen w-full flex p-6 rounded-lg flex-col bg-white">
      <TitlePage
        title="Manage Schedule"
        contentHref="Add schedule"
        href="/schedule-management/add"
      />
      <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-800">Schedule</h1>
          <Button onClick={handleToday} variant="outline" size="sm">
            Today
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button onClick={handlePrevious} variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-[250px] text-center font-medium text-gray-700">
            {getViewTitle()}
          </div>
          <Button onClick={handleNext} variant="outline" size="sm">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-1">
          <Button
            onClick={() => setViewMode('day')}
            variant={viewMode === 'day' ? 'default' : 'outline'}
            size="sm"
          >
            <Clock className="h-4 w-4 mr-1" />
            Day
          </Button>
          <Button
            onClick={() => setViewMode('week')}
            variant={viewMode === 'week' ? 'default' : 'outline'}
            size="sm"
          >
            <Calendar className="h-4 w-4 mr-1" />
            Week
          </Button>
          <Button
            onClick={() => setViewMode('month')}
            variant={viewMode === 'month' ? 'default' : 'outline'}
            size="sm"
          >
            <Grid3X3 className="h-4 w-4 mr-1" />
            Month
          </Button>
          <Button
            onClick={() => setViewMode('weekList')}
            variant={viewMode === 'weekList' ? 'default' : 'outline'}
            size="sm"
          >
            <List className="h-4 w-4 mr-1" />
            List
          </Button>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
