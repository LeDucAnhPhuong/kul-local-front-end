'use client';

import type React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Schedule, Slot } from '@/features/schedule-management/data.type';
import { motion } from 'framer-motion';
import { MapPin, Users, Clock, User } from 'lucide-react';
// Utility functions
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getWeekDays = (date: Date) => {
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

export const getMonthDays = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  const endDate = new Date(lastDay);

  startDate.setDate(startDate.getDate() - startDate.getDay() + 1);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()) + 1);

  const days = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return days;
};

const isFutureDate = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today to start of day
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0); // Normalize target date to start of day
  return targetDate > today;
};

// Day View Component
export const DayView = ({
  currentDate,
  slots,
  schedules,
  onDragStart,
  onDragEnd,
  onDrop,
}: {
  currentDate: Date;
  slots: Slot[];
  schedules: Schedule[];
  onDragStart: (schedule: Schedule) => void;
  onDragEnd: () => void;
  onDrop: (date: Date, slotId: string) => void;
}) => {
  const daySchedules = schedules.filter((schedule) => {
    const scheduleDate = new Date(schedule.date);
    return scheduleDate.toDateString() === currentDate.toDateString();
  });

  const canDrop = isFutureDate(currentDate);

  const handleDrop = (e: React.DragEvent, slotId: string) => {
    e.preventDefault();
    if (canDrop) {
      onDrop(currentDate, slotId);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="text-lg font-semibold p-4 border-b">{formatDate(currentDate)}</div>
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-[120px_1fr] gap-0">
          {slots.map((slot) => {
            const slotSchedules = daySchedules.filter((s) => s.slotId === slot.id);

            return (
              <div key={slot.id} className="contents">
                <div className="p-3 text-sm text-gray-600 border-r border-b bg-gray-50">
                  <div className="font-medium">{slot.name}</div>
                  <div className="text-xs text-gray-500">
                    {slot.startTime} - {slot.endTime}
                  </div>
                </div>
                <div
                  className={cn(
                    'min-h-[80px] border-b border-gray-200 p-2 transition-colors',
                    canDrop ? 'hover:bg-gray-50' : 'bg-gray-50 cursor-not-allowed',
                  )}
                  onDrop={(e) => handleDrop(e, slot.id)}
                  onDragOver={handleDragOver}
                >
                  <div className="space-y-2">
                    {slotSchedules.map((schedule) => (
                      <ScheduleEvent
                        key={schedule.id}
                        schedule={schedule}
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                        isDraggable={isFutureDate(new Date(schedule.date))}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Week View Component
export const WeekView = ({
  currentDate,
  slots,
  schedules,
  onDragStart,
  onDragEnd,
  onDrop,
}: {
  currentDate: Date;
  slots: Slot[];
  schedules: Schedule[];
  onDragStart: (schedule: Schedule) => void;
  onDragEnd: () => void;
  onDrop: (date: Date, slotId: string) => void;
}) => {
  const weekDays = getWeekDays(currentDate);

  const handleDrop = (e: React.DragEvent, date: Date, slotId: string) => {
    e.preventDefault();
    if (isFutureDate(date)) {
      onDrop(date, slotId);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-[120px_repeat(7,1fr)] gap-0 border-b">
        <div className="p-3 bg-gray-50"></div>
        {weekDays.map((day, index) => (
          <div key={index} className="p-3 text-center border-l bg-gray-50">
            <div className="font-medium">
              {day.toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <div className="text-sm text-gray-500">{day.getDate()}</div>
          </div>
        ))}
      </div>
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-[120px_repeat(7,1fr)] gap-0">
          {slots.map((slot) => (
            <div key={slot.id} className="contents">
              <div className="p-3 text-sm text-gray-600 border-r border-b bg-gray-50">
                <div className="font-medium text-xs">{slot.name}</div>
                <div className="text-xs text-gray-500">
                  {slot.startTime} - {slot.endTime}
                </div>
              </div>
              {weekDays.map((day, dayIndex) => {
                const daySchedules = schedules.filter((schedule) => {
                  const scheduleDate = new Date(schedule.date);
                  return (
                    scheduleDate.toDateString() === day.toDateString() &&
                    schedule.slotId === slot.id
                  );
                });

                const canDropCell = isFutureDate(day);

                return (
                  <div
                    key={dayIndex}
                    className={cn(
                      'min-h-[70px] border-b border-l border-gray-200 p-1 transition-colors',
                      canDropCell ? 'hover:bg-gray-50' : 'bg-gray-50  cursor-not-allowed',
                    )}
                    onDrop={(e) => handleDrop(e, day, slot.id)}
                    onDragOver={handleDragOver}
                  >
                    <div className="space-y-1">
                      {daySchedules.map((schedule) => (
                        <ScheduleEvent
                          key={schedule.id}
                          schedule={schedule}
                          onDragStart={onDragStart}
                          onDragEnd={onDragEnd}
                          compact={true}
                          isDraggable={isFutureDate(new Date(schedule.date))}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Month View Component
export const MonthView = ({
  currentDate,
  schedules,
  onDragStart,
  onDragEnd,
  onDrop,
}: {
  currentDate: Date;
  schedules: Schedule[];
  onDragStart: (schedule: Schedule) => void;
  onDragEnd: () => void;
  onDrop: (date: Date, slotId?: string) => void;
}) => {
  const monthDays = getMonthDays(currentDate);
  const weeks = [];

  for (let i = 0; i < monthDays.length; i += 7) {
    weeks.push(monthDays.slice(i, i + 7));
  }

  const handleDrop = (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    if (isFutureDate(date)) {
      onDrop(date);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-7 gap-0 border-b">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <div key={day} className="p-3 text-center font-medium border-r bg-gray-50">
            {day}
          </div>
        ))}
      </div>
      <div className="flex-1 grid grid-rows-6 gap-0">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-0">
            {week.map((day, dayIndex) => {
              const daySchedules = schedules.filter((schedule) => {
                const scheduleDate = new Date(schedule.date);
                return scheduleDate.toDateString() === day.toDateString();
              });
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const canDropCell = isFutureDate(day);

              return (
                <div
                  key={dayIndex}
                  className={cn(
                    'border-r border-b p-2 min-h-[120px] transition-colors',
                    !isCurrentMonth && 'bg-gray-50 text-gray-400',
                    canDropCell ? 'hover:bg-gray-50' : 'bg-gray-50  cursor-not-allowed',
                  )}
                  onDrop={(e) => handleDrop(e, day)}
                  onDragOver={handleDragOver}
                >
                  <div className="font-medium mb-2">{day.getDate()}</div>
                  <div className="space-y-1">
                    {daySchedules.slice(0, 2).map((schedule) => (
                      <ScheduleEvent
                        key={schedule.id}
                        schedule={schedule}
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                        compact={true}
                        isDraggable={isFutureDate(new Date(schedule.date))}
                      />
                    ))}
                    {daySchedules.length > 2 && (
                      <div className="text-xs text-gray-500 bg-gray-200 rounded px-1 py-0.5">
                        +{daySchedules.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

// Week List View Component
export const WeekListView = ({
  currentDate,
  schedules,
  onDragStart,
  onDragEnd,
  onDrop,
}: {
  currentDate: Date;
  schedules: Schedule[];
  onDragStart: (schedule: Schedule) => void;
  onDragEnd: () => void;
  onDrop: (date: Date, slotId: string) => void;
}) => {
  const weekDays = getWeekDays(currentDate);

  const handleDrop = (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    if (isFutureDate(date)) {
      onDrop(date, '6850beebc5731d80e6ed0634');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="text-lg font-semibold">
          Week {Math.ceil(currentDate.getDate() / 7)} -{' '}
          {currentDate.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </h3>
      </div>
      <div className="flex-1 overflow-auto">
        {weekDays.map((day, index) => {
          const daySchedules = schedules.filter((schedule) => {
            const scheduleDate = new Date(schedule.date);
            return scheduleDate.toDateString() === day.toDateString();
          });

          const canDropCell = isFutureDate(day);

          return (
            <div key={index} className="border-b">
              <div
                className={cn(
                  'p-4 transition-colors',
                  canDropCell ? 'hover:bg-gray-50' : 'bg-gray-50  cursor-not-allowed',
                )}
                onDrop={(e) => handleDrop(e, day)}
                onDragOver={handleDragOver}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-lg">
                    {day.toLocaleDateString('en-US', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'short',
                    })}
                  </h4>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {daySchedules.length} schedule
                  </span>
                </div>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {daySchedules.length === 0 ? (
                    <div className="text-gray-400 text-sm italic col-span-full">Not Found</div>
                  ) : (
                    daySchedules.map((schedule) => (
                      <Card key={schedule.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-3">
                          <ScheduleEvent
                            schedule={schedule}
                            onDragStart={onDragStart}
                            onDragEnd={onDragEnd}
                            isDraggable={isFutureDate(new Date(schedule.date))}
                          />
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface ScheduleEventProps {
  schedule: Schedule;
  onDragStart: (schedule: Schedule) => void;
  onDragEnd: () => void;
  style?: React.CSSProperties;
  compact?: boolean;
  isDraggable?: boolean;
}

export const getEventColor = (classId: string) => {
  // Generate consistent color based on class ID
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

export default function ScheduleEvent({
  schedule,
  onDragStart,
  onDragEnd,
  style = {},
  compact = false,
  isDraggable = true,
}: ScheduleEventProps) {
  const eventColor = getEventColor(schedule.classId);

  return (
    <motion.div
      draggable={isDraggable}
      onDragStart={isDraggable ? () => onDragStart(schedule) : undefined}
      onDragEnd={isDraggable ? onDragEnd : undefined}
      className={cn(
        'p-2 rounded-lg text-white text-xs shadow-sm border border-white/20',
        eventColor,
        isDraggable
          ? 'cursor-move hover: transition-all duration-200'
          : 'cursor-not-allowed opacity-70',
      )}
      style={style}
      whileHover={isDraggable ? { scale: 1.02, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' } : {}}
      whileDrag={isDraggable ? { scale: 1.05, zIndex: 1000, rotate: 2 } : {}}
    >
      <div className="space-y-1">
        {/* Class Name */}
        <div className="font-semibold truncate text-sm">{schedule.classInfor.name}</div>

        {/* Slot Info */}
        <div className="flex items-center gap-1 ">
          <Clock className="h-3 w-3" />
          <span className="text-xs">
            {schedule.slot.startTime} - {schedule.slot.endTime}
          </span>
        </div>
        <div className="flex items-center gap-1 ">
          <User className="h-3 w-3" />
          <span className="text-xs truncate">
            {schedule.coach.firstName} {schedule.coach.lastName}
          </span>
        </div>

        {!compact && (
          <>
            {/* Room Info */}
            <div className="flex items-center gap-1 ">
              <MapPin className="h-3 w-3" />
              <span className="text-xs truncate">
                {schedule.room.name} ({schedule.room.location})
              </span>
            </div>

            {/* Coach Info */}

            {/* Capacity */}
            <div className="flex items-center gap-1 ">
              <Users className="h-3 w-3" />
              <span className="text-xs">{schedule.room.capacity} seats</span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
