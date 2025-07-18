import type { ScheduleItem } from '../types/schedule';

export function convertToMobileSchedule(data: ScheduleItem[], allSlots: any[] = []) {
    if (!Array.isArray(data) || !Array.isArray(allSlots)) return [];

  const dayMap: Record<string, { date: string; dayName: string; slots: any[] }> = {};
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };

  const createDaysWithAllSlots = (startDate: Date) => {
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);

      const dateKey = currentDate.toISOString().split('T')[0];
      const formatted = currentDate.toLocaleDateString('en-GB', options);
      const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });

      if (!dayMap[dateKey]) {
        dayMap[dateKey] = {
          date: formatted,
          dayName,
          slots: [],
        };

        allSlots.forEach((slot) => {
          dayMap[dateKey].slots.push({
            _id: `empty-${slot._id}-${dateKey}`,
            slot: slot,
            classInfo: null,
            room: null,
            coach: null,
            isEmpty: true,
          });
        });
      }
    }
  };

  if (data.length > 0) {
    const firstDate = new Date(data[0].date);
    const monday = getMonday(firstDate);
    createDaysWithAllSlots(monday);
  } else if (allSlots.length > 0) {
    const today = new Date();
    const monday = getMonday(today);
    createDaysWithAllSlots(monday);
  }

  data.forEach((item) => {
    const dateObj = new Date(item.date);
    const dateKey = dateObj.toISOString().split('T')[0];

    if (dayMap[dateKey]) {
      const slotIndex = dayMap[dateKey].slots.findIndex(
        (s) => s.slot?._id === item.slot?._id && s.isEmpty,
      );

      if (slotIndex !== -1) {
        dayMap[dateKey].slots[slotIndex] = {
          ...item,
          isEmpty: false,
        };
      }
    }
  });

  Object.values(dayMap).forEach((day) => {
    day.slots.sort((a, b) => {
      const timeA = a.slot?.startTime?.replace(':', '') || '0000';
      const timeB = b.slot?.startTime?.replace(':', '') || '0000';
      return timeA.localeCompare(timeB);
    });
  });

  return Object.values(dayMap)
    .filter((day) => day.slots.some((slot) => !slot.isEmpty)) // chỉ giữ ngày có ít nhất 1 slot thật
    .sort((a, b) => {
      const dateA = new Date(a.date.split(' ').slice(1).join(' '));
      const dateB = new Date(b.date.split(' ').slice(1).join(' '));
      return dateA.getTime() - dateB.getTime();
    });
}

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export type { MobileRow };

type MobileRow = {
  date: string;
  dayName: string;
  slots: (ScheduleItem & { isEmpty?: boolean })[];
};
