import type { SlotSchedule } from '../columns/schedule.columns';
import type { ScheduleCell } from '../columns/schedule.columns';

type SlotByDay = {
  day: string;
  [slotName: string]: ScheduleCell | string | undefined;
};

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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
