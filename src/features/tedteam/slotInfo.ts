export type DayKey = "t2" | "t3" | "t4" | "t5" | "t6" | "t7" | "cn"

export interface Room {
  name: string;
  capacity: number;
  location: string;
  description: string;
  _id: string;
  isActive: boolean;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  email: string;
  role: string;
  profile_image: string;
  first_name: string;
  last_name: string;
  _id: string;
  isActive: boolean;
   created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClassInfo {
  name: string;
  startTime: string; // ISO string
  endTime: string;
  _id: string;
  isActive: boolean;
   created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Slot {
  name: string;
  startTime: string; // format: HH:mm
  endTime: string;
  _id: string;
  isActive: boolean;
   created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScheduleItem {
  room: Room;
  coach: User;
  classInfo: ClassInfo | null;
  slot: Slot;
  date: string; // ISO date string
  _id: string;
  tedTeamId: string | null;
  isActive: boolean;
   created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}
export interface UserSchedule {
  userId: string | null;
  schedule: ScheduleItem;
  status: number;
  user: User;
  scheduleId: string | null;
  _id: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  isActive: boolean;
}

export type ScheduleCell = {
  topic?: string
  instructor: string
  location: string
  time: string
  status: "not yet" | "present" | "absent"
  date: string
  class_id?: string | null
  room_id?: string | null
  coach_id?: string | null
  tedTeam_id?: string | null
}

export type RegisterScheduleCell = {
  id: string
  slot_id: {
    _id: number
    name: "Slot 1" | "Slot 2" | "Slot 3"
    start_time: string
    end_time: string
    description: string
    isActive: boolean
    created_by: number
    updated_by: number
    created_at: string
    updated_at: string
  }
  date: string
  time: string
  status: "register" | "registered" | "unregistered" | "full"
}

export type SlotSchedule = {
  slot: string
  t2?: ScheduleCell
  t3?: ScheduleCell
  t4?: ScheduleCell
  t5?: ScheduleCell
  t6?: ScheduleCell
  t7?: ScheduleCell
  cn?: ScheduleCell
}

export type RegisterSlotSchedule = {
  slot: string
  t2?: RegisterScheduleCell
  t3?: RegisterScheduleCell
  t4?: RegisterScheduleCell
  t5?: RegisterScheduleCell
  t6?: RegisterScheduleCell
  t7?: RegisterScheduleCell
  cn?: RegisterScheduleCell
}

interface Classes {
  _id: number
  name: string
  schedule: string
  room_id: number
  members: number
  isActive: boolean
  created_by: number
  updated_by: number
  created_at: string
  updated_at: string
}

interface ClassCalendar {
  _id: number
  class_id: number
  date: string  
  slot_id: number
  room_id: number
  coach_id: number
  TedTeam_id: number
  note: string
  isActive: boolean
  created_by: number
  updated_by: number
  created_at: string
  updated_at: string
  classes: Classes
}

export interface AttendanceData {
  _id: string
  schedule_id: string 
  user_id: string
  status: number
  isActive: boolean
  created_by: number | null
  updated_by: number| null
  created_at: string
  updated_at: string
  schedule: ClassCalendar
}

export type RegistrationStatus = "register" | "registered" | "unregistered" | "full"

export interface TimeSlot {
  slot_id: string
  time_range: string
  start_time: string
  end_time: string
}

export interface ScheduleSlot {
  id: string
  day: DayKey
  date: string
  slot: TimeSlot
  current_registrations: number
  max_capacity: number
  status: RegistrationStatus
  class_ids: string[]
}

export interface DaySchedule {
  [slot_id: string]: ScheduleSlot
}

export type WeekSchedule = {
  [day in DayKey]?: DaySchedule
}
