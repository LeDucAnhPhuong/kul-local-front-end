'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type {
  Class,
  Coach,
  CreateScheduleRequest,
  Room,
  ScheduleFormData,
  Slot,
} from '../data.type';
import { useScheduleData } from '@/hooks/useSchedule';
import { useCalendarData } from '@/hooks/useScheduleCalnedar';
import { useCreateScheduleMutation } from '../api.schedule';
import ScheduleFormModalV2 from '@/components/ui/schedule-modal-form';
import { getDateRange } from '../components';

const getWeekDays = (date: Date) => {
  const week = [];
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);

  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    week.push(day);
  }
  return week;
};

const ScheduleEvent = ({ schedule }: { schedule: any }) => {
  const getEventColor = (classId: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
      'bg-red-500',
    ];

    let hash = 0;
    for (let i = 0; i < classId.length; i++) {
      hash = classId.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  const eventColor = getEventColor(schedule.classId);

  return (
    <div
      className={cn(
        'p-2 rounded-lg text-white text-xs shadow-sm border border-white/20 mb-1',
        eventColor,
      )}
    >
      <div className="space-y-1">
        <div className="font-semibold truncate text-sm">
          {schedule.classInfor?.name || 'Unknown Class'}
        </div>
        <div className="flex items-center gap-1 opacity-90">
          <span className="text-xs">
            {schedule.slot?.startTime} - {schedule.slot?.endTime}
          </span>
        </div>
        <div className="flex items-center gap-1 opacity-90">
          <span className="text-xs truncate">
            {schedule.room?.name} ({schedule.room?.location})
          </span>
        </div>
        <div className="flex items-center gap-1 opacity-90">
          <span className="text-xs truncate">
            {schedule.coach?.firstName} {schedule.coach?.lastName}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function ScheduleCreatorCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlotData, setSelectedSlotData] = useState<Partial<ScheduleFormData>>({});

  const { startDate, endDate } = getDateRange('week', currentDate);

  const { slots, rooms, classes, coaches, loading } = useScheduleData();
  const { schedules, loading: schedulesLoading } = useCalendarData({ startDate, endDate });
  const [createSchedule] = useCreateScheduleMutation();

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleSlotClick = useCallback(
    (date: Date, slotId: string) => {
      const existingSchedules = schedules.filter((schedule: any) => {
        const scheduleDate = new Date(schedule.date);
        return scheduleDate.toDateString() === date.toDateString() && schedule.slotId === slotId;
      });

      setSelectedSlotData({
        date,
        slotIds: slotId,
        existingSchedules,
      });
      setIsModalOpen(true);
    },
    [schedules],
  );

  const handleCreateSchedule = useCallback(
    async (data: CreateScheduleRequest) => {
      const toastId = toast.loading('Creating schedule...');
      try {
        await createSchedule(data).unwrap();
        toast.success('Schedule created successfully!', {
          id: toastId,
        });
        setIsModalOpen(false);
      } catch (error) {
        console.error('Error creating schedule:', error);
        toast.error('An error occurred while creating the schedule!', {
          id: toastId,
        });
      }
    },
    [createSchedule],
  );

  const getViewTitle = () => {
    const weekStart = getWeekDays(currentDate)[0];
    const weekEnd = getWeekDays(currentDate)[6];
    return `${weekStart.getDate()} - ${weekEnd.getDate()} ${currentDate.toLocaleDateString(
      'en-US',
      { month: 'long', year: 'numeric' },
    )}`;
  };

  if (loading || schedulesLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading data...</span>
        </div>
      </div>
    );
  }

  const weekDays = getWeekDays(currentDate);

  return (
    <div className="h-screen flex flex-col bg-white">
      <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-800">Create Schedule</h1>
          <Button onClick={handleToday} variant="outline" size="sm">
            This Week
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

        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-500">Click on a slot to create</div>
          <Plus className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="grid grid-cols-[120px_repeat(7,1fr)] gap-0 border-b bg-gray-50">
            <div className="p-3 font-medium text-gray-600">Time</div>
            {weekDays.map((day, index) => {
              const isToday = day.toDateString() === new Date().toDateString();
              return (
                <div key={index} className="p-3 text-center border-l">
                  <div className={cn('font-medium', isToday && 'text-blue-600')}>
                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div
                    className={cn('text-sm text-gray-500', isToday && 'text-blue-500 font-medium')}
                  >
                    {day.getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-[120px_repeat(7,1fr)] gap-0">
              {slots.map((slot: Slot) => (
                <div key={slot.id} className="contents">
                  <div className="p-3 text-sm text-gray-600 border-r border-b bg-gray-50 sticky left-0">
                    <div className="font-medium">{slot.name}</div>
                    <div className="text-xs text-gray-500">
                      {slot.startTime} - {slot.endTime}
                    </div>
                  </div>

                  {weekDays.map((day, dayIndex) => {
                    const isToday = day.toDateString() === new Date().toDateString();
                    const isPast = day < new Date(new Date().setHours(0, 0, 0, 0));

                    const daySchedules = schedules.filter((schedule: any) => {
                      const scheduleDate = new Date(schedule.date);
                      return (
                        scheduleDate.toDateString() === day.toDateString() &&
                        schedule.slotId === slot.id
                      );
                    });

                    const hasSchedules = daySchedules.length > 0;
                    const usedRoomIds = daySchedules.map((s: any) => s.roomId);
                    const usedClassIds = daySchedules.map((s: any) => s.classId);
                    const usedCoachEmails = daySchedules.map(
                      (s: any) => s.coachEmail || s.coach?.email,
                    );

                    const availableRooms = rooms.filter(
                      (room: Room) => !usedRoomIds.includes(room.id),
                    );
                    const availableClasses = classes.filter(
                      (cls: Class) => !usedClassIds.includes(cls.id),
                    );
                    const availableCoaches = coaches.filter(
                      (coach: Coach) => !usedCoachEmails.includes(coach.email),
                    );

                    const canCreateNew =
                      !isPast &&
                      availableRooms.length > 0 &&
                      availableClasses.length > 0 &&
                      availableCoaches.length > 0;

                    return (
                      <motion.div
                        key={dayIndex}
                        className={cn(
                          'min-h-[80px] border-b border-l border-gray-200 p-2 transition-all duration-200',
                          canCreateNew && 'cursor-pointer hover:bg-blue-50 hover:border-blue-200',
                          isToday && 'bg-blue-25',
                          isPast && 'bg-gray-50 opacity-60',
                          hasSchedules && 'bg-white',
                          !canCreateNew && !isPast && hasSchedules && 'bg-gray-25',
                        )}
                        whileHover={canCreateNew ? { scale: 1.02 } : {}}
                        whileTap={canCreateNew ? { scale: 0.98 } : {}}
                        onClick={() => canCreateNew && handleSlotClick(day, slot.id)}
                      >
                        <div className="h-full flex flex-col">
                          {hasSchedules && (
                            <div className="space-y-1 mb-2">
                              {daySchedules.map((schedule: any) => (
                                <ScheduleEvent key={schedule.id} schedule={schedule} />
                              ))}
                            </div>
                          )}

                          {canCreateNew && (
                            <div className="flex-1 flex items-center justify-center group">
                              <div className="flex flex-col items-center gap-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Plus className="h-4 w-4" />
                                <span className="text-xs">
                                  {hasSchedules ? 'Add schedule' : 'Create schedule'}
                                </span>
                              </div>
                            </div>
                          )}

                          {!canCreateNew && !isPast && hasSchedules && (
                            <div className="flex-1 flex items-center justify-center">
                              <div className="text-xs text-gray-400 text-center">
                                <div>Full</div>
                                <div className="text-xs">
                                  ({availableRooms.length}R, {availableClasses.length}C,{' '}
                                  {availableCoaches.length}T)
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ScheduleFormModalV2
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedSlotData}
        slots={slots}
        rooms={rooms}
        classes={classes}
        coaches={coaches}
        onSubmit={handleCreateSchedule}
      />
    </div>
  );
}
