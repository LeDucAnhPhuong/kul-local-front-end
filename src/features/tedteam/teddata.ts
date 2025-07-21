import type {
  AttendanceData,
  SlotSchedule,
  DayKey,
  ScheduleCell,
  RegisterSlotSchedule,
  RegisterScheduleCell,
  UserSchedule,
  Slot,
} from './slotInfo';


const getDayKey = (date: string): DayKey => {
  const dayOfWeek = new Date(date).getDay();
  const dayKeyMap = {
    0: 'cn' as const,
    1: 't2' as const,
    2: 't3' as const,
    3: 't4' as const,
    4: 't5' as const,
    5: 't6' as const,
    6: 't7' as const,
  };
  return dayKeyMap[dayOfWeek as keyof typeof dayKeyMap];
};

const getDayKeyFromDateString = (dateString: string): DayKey => {
  return getDayKey(dateString);
};

export const transformAttendanceData = (data: UserSchedule[], slot: Slot[]): SlotSchedule[] => {
  const slotMap = new Map<string, SlotSchedule>();

  slot.forEach((s) => {
    slotMap.set(s.name, {
      slot: s.name,
    });
  });

  data.forEach((item) => {
    console.log('item', item);
    const slotName = item.schedule.slot?.name || 'Unknown Slot';
    const dayKey = getDayKey(item.schedule.date);

    const schedule = slotMap.get(slotName)!;
    const scheduleCell: ScheduleCell = {
      topic: item.schedule.classInfor?.name,
      instructor: `Coach ${item.schedule.coach.firstName} ${item.schedule.coach.lastName}`,
      location: `Room ${item.schedule.room.name}`,
      time: `${item.schedule.slot.startTime} - ${item.schedule.slot.endTime}`,
      status: getStatus(item.status),
      date: item.schedule.date,
      classId: item.schedule.classInfor?.name,
      roomId: item.schedule.room?.name,
      coachId: item.schedule.coach?.email,
    };

    schedule[dayKey] = scheduleCell;
  });

  return Array.from(slotMap.values());
};

export const getStatus = (status: number): 'not yet' | 'present' | 'absent' => {
  switch (status) {
    case 0:
      return 'not yet';
    case 1:
      return 'present';
    case 2:
      return 'absent';
    default:
      return 'not yet';
  }
};

export const transformRegisterScheduleData = (
  data: RegisterScheduleCell[],
  slots: Slot[],
): RegisterSlotSchedule[] => {
  const slotMap = new Map<string, RegisterSlotSchedule>();

  slots?.forEach((slot) => {
    slotMap.set(slot?.name, {
      slot: slot?.name,
    });
  });

  console.log('slotMap', slotMap);

  data.forEach((item) => {
    const slotName = item?.schedule?.slot?.name;
    const dayKey = getDayKeyFromDateString(item?.schedule?.date || '');


    const schedule = slotMap.get(slotName) || {
      slot: slotName,
    };

    schedule[dayKey] = schedule[dayKey]
      ? {
          ...schedule[dayKey],
          schedule: {
            ...schedule[dayKey].schedule,
            scheduleIds: [...(schedule[dayKey].schedule.scheduleIds ?? []), item.scheduleId], // assign as string, not array
          },
        }
      : {
          ...item,
          schedule: {
            ...item.schedule,
            scheduleIds: [item.scheduleId], 
          },
        };
  });
  console.log('data', slotMap);

  return Array.from(slotMap?.values());
};

export const getAttendanceByDate = (data: AttendanceData[], date: string): AttendanceData[] => {
  return data.filter((item) => item.schedule.date === date);
};

export const getAttendanceByStatus = (
  data: AttendanceData[],
  status: 'not yet' | 'present' | 'absent',
): AttendanceData[] => {
  return data.filter((item) => getStatus(item.status) === status);
};

export const getAttendanceByUserId = (data: AttendanceData[], userId: string): AttendanceData[] => {
  return data.filter((item) => item.userId === userId);
};

export const getAttendanceStatistics = (data: AttendanceData[]) => {
  const total = data.length;
  const present = data.filter((item) => getStatus(item.status) === 'present').length;
  const absent = data.filter((item) => getStatus(item.status) === 'absent').length;
  const notYet = data.filter((item) => getStatus(item.status) === 'not yet').length;

  return {
    total,
    present,
    absent,
    notYet,
    presentRate: total > 0 ? ((present / total) * 100).toFixed(2) : '0',
    absentRate: total > 0 ? ((absent / total) * 100).toFixed(2) : '0',
  };
};

export const getRegisterScheduleByDate = (
  data: RegisterScheduleCell[],
  date: string,
): RegisterScheduleCell[] => {
  return data.filter((item) => item.schedule?.date === date);
};

export const getRegisterStatus = (
  status: number,
): 'register' | 'registered' | 'approved' | 'rejected' | 'closed' => {
  switch (status) {
    case 0:
      return 'register';
    case 1:
      return 'registered';
    case 2:
      return 'approved';
    case 3:
      return 'rejected';
    case 4:
      return 'closed';
    default:
      return 'closed';
  }
};

export const getRegisterScheduleByStatus = (
  data: RegisterScheduleCell[],
  status: 'register' | 'registered' | 'unregistered' | 'full',
): RegisterScheduleCell[] => {
  return data.filter((item) => getRegisterStatus(item.status) === status);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (startTime: string, endTime: string): string => {
  return `${startTime} - ${endTime}`;
};

export const getDayName = (dayKey: DayKey): string => {
  const dayNames: Record<DayKey, string> = {
    cn: 'Chủ nhật',
    t2: 'Thứ 2',
    t3: 'Thứ 3',
    t4: 'Thứ 4',
    t5: 'Thứ 5',
    t6: 'Thứ 6',
    t7: 'Thứ 7',
  };
  return dayNames[dayKey];
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'present':
      return 'text-green-600 bg-green-100';
    case 'absent':
      return 'text-red-600 bg-red-100';
    case 'not yet':
      return 'text-yellow-600 bg-yellow-100';
    case 'registered':
      return 'text-blue-600 bg-blue-100';
    case 'register':
      return 'text-purple-600 bg-purple-100';
    case 'full':
      return 'text-gray-600 bg-gray-100';
    case 'unregistered':
      return 'text-orange-600 bg-orange-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};
