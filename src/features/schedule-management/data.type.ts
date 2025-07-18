export interface RoomData {
  name: string;
  capacity: number;
  location: string;
  description: string;
  _id: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  isActive: boolean;
}


// Slot types
export interface Slot {
  id: string
  name: string
  startTime: string // "HH:MM" format
  endTime: string
  createdAt: string
  updatedAt: string
  isActive: boolean
  createdBy: string | null
  updatedBy: string | null
}

export interface SlotsResponse {
  data: Slot[]
  message: string
}

// Schedule types
export interface Room {
  id: string
  name: string
  capacity: number
  location: string
  description: string
  createdAt: string
  updatedAt: string
  isActive: boolean
  createdBy: string | null
  updatedBy: string | null
}

export interface ClassInfo {
  id: string
  name: string
  startTime: string // ISO date string
  endTime: string
  createdAt: string
  updatedAt: string
  isActive: boolean
  createdBy: string | null
  updatedBy: string | null
}

export interface Coach {
  id: string
  profileImage?: string
  email: string
  firstName: string
  lastName: string
  classId?: string | null
  role?: string
  createdAt?: string
  updatedAt?: string
  isActive?: boolean
  createdBy?: string | null
  updatedBy?: string | null
}

export interface Schedule {
  id: string
  room: Room
  slot: Slot
  classInfor: ClassInfo
  tedTeam: any | null
  coach: Coach
  roomId: string
  slotId: string
  classId: string
  tedTeamId: string | null
  date: string // ISO date string
  coachId: string
  note: string | null
  createdAt: string
  updatedAt: string
  isActive: boolean
  createdBy: string | null
  updatedBy: string | null
}

export type ViewMode = "day" | "week" | "month" | "weekList"

export interface CreateScheduleRequest {
  date: string // ISO string
  roomId: string
  slotIds: string
  classId: string
  coachEmail: string
}

export interface Slot {
  id: string
  name: string
  startTime: string
  endTime: string
  isActive: boolean
}

export interface Room {
  id: string
  name: string
  location: string
  capacity: number
}

export interface Class {
  id: string
  name: string
  description?: string
}

export interface Coach {
  id: string
  email: string
  firstName: string
  lastName: string
}

export interface ScheduleFormData {
  date: Date
  roomId: string
  slotIds: string
  classId: string
  coachEmail: string
  existingSchedules?: Schedule[]
}

