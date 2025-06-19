export interface ScheduleItem {
  room: {
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
  };
  coach: {
    email: string;
    role: string;
    profile_image: string;
    first_name: string;
    last_name: string;
    class_id: null;
    _id: string;
    created_at: string;
    updated_at: string;
    created_by: null;
    updated_by: null;
    isActive: true;
  };
  classInfo: {
    name: string;
    startTime: string;
    endTime: string;
    _id: string;
    created_at: string;
    updated_at: string;
    created_by: string | null;
    updated_by: string | null;
    isActive: boolean;
  };
  slot: {
    name: string;
    startTime: string;
    endTime: string;
    _id: string;
    created_at: string;
    updated_at: string;
    created_by: string | null;
    updated_by: string | null;
    isActive: boolean;
  };
  classId: string;
  roomId: string;
  slotId: string;
  coachId: string;
  tedTeamId: string | null;
  date: string;
  note: string | null;
  _id: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  isActive: boolean;
}
