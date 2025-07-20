export type DayKey = 't2' | 't3' | 't4' | 't5' | 't6' | 't7' | 'cn';

export interface Room {
  name: string;
  capacity: number;
  location: string;
  description: string;
  id: string;
  isActive: boolean;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  email: string;
  role: string;
  profileImage: string;
  firstName: string;
  lastName: string;
  id: string;
  isActive: boolean;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ClassInfor {
  name: string;
  startTime: string; // ISO string
  endTime: string;
  id: string;
  isActive: boolean;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Slot {
  name: string;
  startTime: string; // format: HH:mm
  endTime: string;
  id: string;
  isActive: boolean;
  createdBy: string | null;
  updatedBy: string | null;
  createdÁt: string;
  updatedÂt: string;
}

export interface ScheduleItem {
  room: Room;
  coach: User;
  classInfor: ClassInfor | null;
  slot: Slot;
  date: string; // ISO date string
  id?: string;
  tedTeamId: string | null;
  isActive: boolean;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updateAt: string;
  scheduleIds?: string[];
}
export interface UserSchedule {
  userId: string | null;
  schedule: ScheduleItem;
  status: number;
  user: User;
  scheduleId: string | null;
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
  isActive: boolean;
}

export type ScheduleCell = {
  topic?: string;
  instructor: string;
  location: string;
  time: string;
  status: 'not yet' | 'present' | 'absent';
  date: string;
  classId?: string | null;
  roomId?: string | null;
  coachId?: string | null;
  tedTeamId?: string | null;
};

export type RegisterScheduleCell = {
  id: string;
  schedule: ScheduleItem;
  status: number;
  scheduleId: string;
};

export type SlotSchedule = {
  slot: string;
  t2?: ScheduleCell;
  t3?: ScheduleCell;
  t4?: ScheduleCell;
  t5?: ScheduleCell;
  t6?: ScheduleCell;
  t7?: ScheduleCell;
  cn?: ScheduleCell;
};

export type RegisterSlotSchedule = {
  slot: string;
  t2?: RegisterScheduleCell;
  t3?: RegisterScheduleCell;
  t4?: RegisterScheduleCell;
  t5?: RegisterScheduleCell;
  t6?: RegisterScheduleCell;
  t7?: RegisterScheduleCell;
  cn?: RegisterScheduleCell;
};

interface Classes {
  id: number;
  name: string;
  schedule: string;
  roomId: number;
  members: number;
  isActive: boolean;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
}

interface ClassCalendar {
  id: number;
  classId: number;
  date: string;
  slotId: number;
  roomId: number;
  coachId: number;
  TedTeamId: number;
  note: string;
  isActive: boolean;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
  classes: Classes;
}

export interface AttendanceData {
  id: string;
  scheduleId: string;
  userId: string;
  status: number;
  isActive: boolean;
  createdBy: number | null;
  updatedBy: number | null;
  createdAt: string;
  updatedAt: string;
  schedule: ClassCalendar;
}

export type RegistrationStatus = 'register' | 'registered' | 'unregistered' | 'full';

export interface TimeSlot {
  slotId: string;
  timeRange: string;
  startTime: string;
  endTime: string;
}

export interface ScheduleSlot {
  id: string;
  day: DayKey;
  date: string;
  slot: TimeSlot;
  currentRegistrations: number;
  maxCapacity: number;
  status: RegistrationStatus;
  classIds: string[];
}

export interface DaySchedule {
  [slotId: string]: ScheduleSlot;
}

export type WeekSchedule = {
  [day in DayKey]?: DaySchedule;
};
