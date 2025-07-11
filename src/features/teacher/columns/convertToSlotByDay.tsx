import type { ScheduleItem } from '../types/schedule';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export function getDayKeyFromDateString(dateStr: string): string {
  const date = new Date(dateStr);
  return days[date.getDay() === 0 ? 6 : date.getDay() - 1];
}
export function convertToSlotByDay(data: ScheduleItem[], allSlots: any[] = []) {
  if (!Array.isArray(data) || !Array.isArray(allSlots)) return [];
  const slotMap: Record<string, any> = {};

  // Đầu tiên, tạo tất cả các slot từ danh sách allSlots
  allSlots.forEach((slot) => {
    const slotName = slot.name || 'Unknown Slot';
    if (!slotMap[slotName]) {
      slotMap[slotName] = {
        slotName,
        slotId: slot._id,
        startTime: slot.startTime,
        endTime: slot.endTime,
      };
      // Khởi tạo tất cả các ngày với null
      days.forEach((day) => {
        slotMap[slotName][day] = null;
      });
    }
  });

  data.forEach((item) => {
    const slotName = item.slot?.name || 'Unknown Slot';
    const date = new Date(item.date);
    const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1];

    if (!slotMap[slotName]) {
      slotMap[slotName] = { slotName };
      days.forEach((day) => {
        slotMap[slotName][day] = null;
      });
    }
    slotMap[slotName][dayName] = item;
  });

  return Object.values(slotMap).sort((a: any, b: any) => {
    const timeA = a.startTime || '00:00';
    const timeB = b.startTime || '00:00';
    return timeA.localeCompare(timeB);
  });
}
