import type { ScheduleItem } from '../types/schedule';

export function getAllSlots(data: ScheduleItem[]) {
  const slotSet = new Map<string, ScheduleItem['slot']>();

  data.forEach((item) => {
    const slot = item.slot;
    if (slot?.name && !slotSet.has(slot.name)) {
      slotSet.set(slot.name, slot);
    }
  });

  return Array.from(slotSet.values());
}
