'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  MapPin,
  Users,
  Mail,
  BookOpen,
  Clock,
  Check,
  ChevronsUpDown,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type {
  ScheduleFormData,
  Slot,
  Room,
  Class,
  Coach,
  CreateScheduleRequest,
} from '@/features/schedule-management/data.type';
import { zoneTimeToUTC } from '@/utils/zone-time-to-utc';

interface ScheduleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: Partial<ScheduleFormData & { existingSchedules?: any[] }>;
  slots: Slot[];
  rooms: Room[];
  classes: Class[];
  coaches: Coach[];
  onSubmit: (data: CreateScheduleRequest) => void;
}

export default function ScheduleFormModalV3({
  isOpen,
  onClose,
  initialData,
  slots,
  rooms,
  classes,
  coaches,
  onSubmit,
}: ScheduleFormModalProps) {
  const [formData, setFormData] = useState<ScheduleFormData>(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return {
      date: now,
      roomId: '',
      slotIds: '',
      classId: '',
      coachEmail: '',
    };
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ScheduleFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openClassCombobox, setOpenClassCombobox] = useState(false);
  const [openCoachCombobox, setOpenCoachCombobox] = useState(false);

  // Lấy danh sách các resource đã được sử dụng
  const existingSchedules = initialData.existingSchedules || [];
  const usedRoomIds = existingSchedules.map((s) => s.room);
  const usedClassIds = existingSchedules.map((s) => s.classInfor);
  const usedCoachEmails = existingSchedules.map((s) => s.coach);

  // Filter available options
  const availableRooms = rooms.filter(
    (room) => !usedRoomIds?.map((usedRoom) => usedRoom.id).includes(room.id),
  );
  const availableClasses = classes.filter(
    (cls) => !usedClassIds.map((usedClass) => usedClass.id).includes(cls.id),
  );
  const availableCoaches = coaches.filter(
    (coach) => !usedCoachEmails.map((usedCoach) => usedCoach.email).includes(coach.email),
  );

  // Slot được chọn từ calendar - không thể thay đổi
  const selectedSlotFromCalendar = initialData.slotIds;

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        date: initialData.date || new Date(),
        roomId: initialData.roomId || '',
        slotIds: initialData.slotIds || '',
        classId: initialData.classId || '',
        coachEmail: initialData.coachEmail || '',
      });
      setErrors({});
    }
  }, [isOpen, initialData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ScheduleFormData, string>> = {};

    if (!formData.roomId) {
      newErrors.roomId = 'Please select a room';
    }

    if (!formData.slotIds) {
      newErrors.slotIds = 'Please select a time slot';
    }

    if (!formData.classId) {
      newErrors.classId = 'Please select a class';
    }

    if (!formData.coachEmail) {
      newErrors.coachEmail = 'Please select a coach';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const date = formData?.date || new Date();
      date.setHours(0, 0, 0, 0);
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const submitData: CreateScheduleRequest = {
        date: zoneTimeToUTC(date, timezone).toISOString(),
        roomId: formData.roomId,
        slotIds: formData.slotIds,
        classId: formData.classId,
        coachEmail: formData.coachEmail,
      };

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Error submitting schedule:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedSlot: Slot | undefined = slots.find((slot) => slot.id === formData.slotIds);
  const selectedRoom: Room | undefined = availableRooms.find((room) => room.id === formData.roomId);
  const selectedClass: Class | undefined = availableClasses.find(
    (cls) => cls.id === formData.classId,
  );
  const selectedCoach: Coach | undefined = availableCoaches.find(
    (coach) => coach.email === formData.coachEmail,
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl mx-4 max-h-[90vh] overflow-auto"
        >
          <Card className="shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-xl font-bold">
                {existingSchedules.length > 0 ? 'Add Schedule' : 'Create New Schedule'}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent>
              {/* Hiển thị thông tin schedules đã có */}
              {existingSchedules.length > 0 && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <span className="font-medium text-amber-800">
                      This slot already has {existingSchedules.length} schedules
                    </span>
                  </div>
                  <div className="text-sm text-amber-700">
                    <div>
                      Used rooms:{' '}
                      {usedRoomIds.length > 0
                        ? usedRoomIds?.map((room) => room.name).join(', ')
                        : 'None'}
                    </div>
                    <div>
                      Used classes:{' '}
                      {usedClassIds.length > 0
                        ? usedClassIds.map((cls) => cls.name).join(', ')
                        : 'None'}
                    </div>
                    <div>
                      Used coaches:{' '}
                      {usedCoachEmails.length > 0
                        ? usedCoachEmails.map((coach) => coach.email).join(', ')
                        : 'None'}
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date Display */}
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-blue-900">Class Date</div>
                    <div className="text-sm text-blue-700">
                      {formData.date.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </div>

                {/* Slot Selection - Disabled khi được chọn từ calendar */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Clock className="h-4 w-4" />
                    Time Slot * {selectedSlotFromCalendar && '(Selected from calendar)'}
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {slots.map((slot) => {
                      const isSelected = formData.slotIds === slot.id;
                      const isDisabled: boolean = selectedSlotFromCalendar !== slot.id;

                      return (
                        <button
                          key={slot.id}
                          type="button"
                          disabled={isDisabled}
                          onClick={() =>
                            !isDisabled && setFormData({ ...formData, slotIds: slot.id })
                          }
                          className={cn(
                            'p-3 rounded-lg border-2 text-left transition-all',
                            isSelected
                              ? 'border-blue-500 bg-blue-50 text-blue-900'
                              : isDisabled
                              ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                              : 'border-gray-200 hover:border-gray-300 hover:shadow-md cursor-pointer',
                          )}
                        >
                          <div className="font-medium text-sm">{slot.name}</div>
                          <div className="text-xs text-gray-500">
                            {slot.startTime} - {slot.endTime}
                          </div>
                          {isSelected && selectedSlotFromCalendar && (
                            <div className="text-xs text-blue-600 mt-1">✓ Selected</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {errors.slotIds && <p className="text-sm text-red-600">{errors.slotIds}</p>}
                </div>

                {/* Room Selection */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <MapPin className="h-4 w-4" />
                    Select Classroom * ({availableRooms.length} rooms available)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {availableRooms.map((room) => (
                      <button
                        key={room.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, roomId: room.id })}
                        className={cn(
                          'p-3 rounded-lg border-2 text-left transition-all hover:shadow-md',
                          formData.roomId === room.id
                            ? 'border-green-500 bg-green-50 text-green-900'
                            : 'border-gray-200 hover:border-gray-300',
                        )}
                      >
                        <div className="font-medium">{room.name}</div>
                        <div className="text-sm text-gray-500">{room.location}</div>
                        <div className="text-xs text-gray-400">{room.capacity} seats</div>
                      </button>
                    ))}
                  </div>
                  {availableRooms.length === 0 && (
                    <p className="text-sm text-amber-600">
                      All classrooms have been used for this slot
                    </p>
                  )}
                  {errors.roomId && <p className="text-sm text-red-600">{errors.roomId}</p>}
                </div>

                {/* Class Selection - Autocomplete */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <BookOpen className="h-4 w-4" />
                    Select Class * ({availableClasses.length} classes available)
                  </label>
                  <Popover open={openClassCombobox} onOpenChange={setOpenClassCombobox}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openClassCombobox}
                        className={cn(
                          'w-full justify-between h-auto p-3',
                          !formData.classId && 'text-muted-foreground',
                          errors.classId && 'border-red-500',
                          availableClasses.length === 0 && 'opacity-50 cursor-not-allowed',
                        )}
                        disabled={availableClasses.length === 0}
                      >
                        {formData.classId ? (
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{selectedClass?.name}</span>
                            {selectedClass?.description && (
                              <span className="text-sm text-gray-500">
                                {selectedClass.description}
                              </span>
                            )}
                          </div>
                        ) : availableClasses.length === 0 ? (
                          'All classes have been used'
                        ) : (
                          'Select a class...'
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search for a class..." />
                        <CommandList>
                          <CommandEmpty>No classes found.</CommandEmpty>
                          <CommandGroup>
                            {availableClasses.map((cls) => (
                              <CommandItem
                                key={cls.id}
                                value={`${cls.name} ${cls.description || ''}`}
                                onSelect={() => {
                                  setFormData({ ...formData, classId: cls.id });
                                  setOpenClassCombobox(false);
                                }}
                                className="flex items-center gap-2 p-3"
                              >
                                <Check
                                  className={cn(
                                    'h-4 w-4',
                                    formData.classId === cls.id ? 'opacity-100' : 'opacity-0',
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span className="font-medium">{cls.name}</span>
                                  {cls.description && (
                                    <span className="text-sm text-gray-500">{cls.description}</span>
                                  )}
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {errors.classId && <p className="text-sm text-red-600">{errors.classId}</p>}
                </div>

                {/* Coach Selection - Autocomplete */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Users className="h-4 w-4" />
                    Select Teacher * ({availableCoaches.length} teachers available)
                  </label>
                  <Popover open={openCoachCombobox} onOpenChange={setOpenCoachCombobox}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openCoachCombobox}
                        className={cn(
                          'w-full justify-between h-auto p-3',
                          !formData.coachEmail && 'text-muted-foreground',
                          errors.coachEmail && 'border-red-500',
                          availableCoaches.length === 0 && 'opacity-50 cursor-not-allowed',
                        )}
                        disabled={availableCoaches.length === 0}
                      >
                        {formData.coachEmail ? (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
                              {selectedCoach?.firstName.charAt(0)}
                            </div>
                            <div className="flex flex-col items-start">
                              <span className="font-medium">
                                {selectedCoach?.firstName} {selectedCoach?.lastName}
                              </span>
                              <span className="text-sm text-gray-500 flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {selectedCoach?.email}
                              </span>
                            </div>
                          </div>
                        ) : availableCoaches.length === 0 ? (
                          'All teachers have been assigned'
                        ) : (
                          'Select a teacher...'
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search for a teacher..." />
                        <CommandList>
                          <CommandEmpty>No teachers found.</CommandEmpty>
                          <CommandGroup>
                            {availableCoaches.map((coach) => (
                              <CommandItem
                                key={coach.id}
                                value={`${coach.firstName} ${coach.lastName} ${coach.email}`}
                                onSelect={() => {
                                  setFormData({ ...formData, coachEmail: coach.email });
                                  setOpenCoachCombobox(false);
                                }}
                                className="flex items-center gap-3 p-3"
                              >
                                <Check
                                  className={cn(
                                    'h-4 w-4',
                                    formData.coachEmail === coach.email
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
                                  {coach.firstName.charAt(0)}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {coach.firstName} {coach.lastName}
                                  </span>
                                  <span className="text-sm text-gray-500 flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    {coach.email}
                                  </span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {errors.coachEmail && <p className="text-sm text-red-600">{errors.coachEmail}</p>}
                </div>

                {/* Summary */}
                {(selectedSlot || selectedRoom || selectedClass || selectedCoach) && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Summary of the lesson schedule:
                    </h4>
                    <div className="space-y-2 text-sm">
                      {selectedSlot && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>
                            {selectedSlot.name}: {selectedSlot.startTime} - {selectedSlot.endTime}
                          </span>
                          {selectedSlotFromCalendar && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              From calendar
                            </span>
                          )}
                        </div>
                      )}
                      {selectedRoom && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>
                            {selectedRoom.name} ({selectedRoom.location})
                          </span>
                        </div>
                      )}
                      {selectedClass && (
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-gray-500" />
                          <span>{selectedClass.name}</span>
                        </div>
                      )}
                      {selectedCoach && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span>
                            {selectedCoach.firstName} {selectedCoach.lastName}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1 bg-transparent"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      availableRooms.length === 0 ||
                      availableClasses.length === 0 ||
                      availableCoaches.length === 0
                    }
                    className="flex-1"
                  >
                    {isSubmitting
                      ? 'Creating...'
                      : existingSchedules.length > 0
                      ? 'Add Lesson Schedule'
                      : 'Create Lesson Schedule'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
