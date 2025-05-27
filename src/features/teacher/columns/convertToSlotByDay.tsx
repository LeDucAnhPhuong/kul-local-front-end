import type { SlotSchedule } from './schedule.columns';
import type { ScheduleCell } from './schedule.columns';

type SlotByDay = {
  day: string;
  [slotName: string]: ScheduleCell | string | undefined;
};

// Các key tương ứng với thứ trong tuần theo cấu trúc mới
const days = ['t2', 't3', 't4', 't5', 't6', 't7', 'cn'];

export function convertToSlotByDay(data: SlotSchedule[]): SlotByDay[] {
  return days.map((day) => {
    const row: SlotByDay = { day };
    data.forEach((slotRow) => {
      const slotKey = slotRow.slot.replace(/\s/g, ''); // "Slot 1" => "Slot1"
      row[slotKey] = slotRow[day as keyof SlotSchedule];
    });
    return row;
  });
}
