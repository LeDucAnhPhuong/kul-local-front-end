// Interfaces
export interface Classes {
  _id: number;
  name: string;
  schedule: string;
  room_id: number;
  members: number;
  isActive: boolean;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
}

export interface ClassCalendar {
  _id: number;
  class_id: number;
  date: string;
  slot_id: number;
  room_id: number;
  coach_id: number;
  TedTeam_id: number;
  note: string;
  isActive: boolean;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  classes: Classes;
}

export interface AttendanceData {
  _id: number;
  calendar_id: number;
  user_id: number;
  status: 'not yet' | 'present' | 'absent';
  isActive: boolean;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  classCalendar: ClassCalendar;
}

// Dummy Data
export const attendanceDummyData: AttendanceData[] = [
  {
    _id: 1,
    calendar_id: 1,
    user_id: 1001,
    status: 'present',
    isActive: true,
    created_by: 1,
    updated_by: 1,
    created_at: '2025-05-27T08:00:00Z',
    updated_at: '2025-05-27T08:00:00Z',
    classCalendar: {
      _id: 1,
      class_id: 101,
      date: '2025-06-02',
      slot_id: 1,
      room_id: 201,
      coach_id: 301,
      TedTeam_id: 401,
      note: 'Focus on pronunciation and fluency',
      isActive: true,
      created_by: 1,
      updated_by: 1,
      created_at: '2025-05-20T08:00:00Z',
      updated_at: '2025-05-20T08:00:00Z',
      classes: {
        _id: 101,
        name: "IELTS Speaking Intensive",
        schedule: "Mon, Wed, Fri - 07:30-09:30",
        room_id: 201,
        members: 15,
        isActive: true,
        created_by: 1,
        updated_by: 1,
        created_at: '2025-05-15T08:00:00Z',
        updated_at: '2025-05-20T08:00:00Z'
      }
    }
  },
  {
    _id: 2,
    calendar_id: 1,
    user_id: 1002,
    status: 'present',
    isActive: true,
    created_by: 1,
    updated_by: 1,
    created_at: '2025-05-27T08:00:00Z',
    updated_at: '2025-05-27T08:00:00Z',
    classCalendar: {
      _id: 1,
      class_id: 101,
      date: '2025-06-02',
      slot_id: 1,
      room_id: 201,
      coach_id: 301,
      TedTeam_id: 401,
      note: 'Focus on pronunciation and fluency',
      isActive: true,
      created_by: 1,
      updated_by: 1,
      created_at: '2025-05-20T08:00:00Z',
      updated_at: '2025-05-20T08:00:00Z',
      classes: {
        _id: 101,
        name: "IELTS Speaking Intensive",
        schedule: "Mon, Wed, Fri - 07:30-09:30",
        room_id: 201,
        members: 15,
        isActive: true,
        created_by: 1,
        updated_by: 1,
        created_at: '2025-05-15T08:00:00Z',
        updated_at: '2025-05-20T08:00:00Z'
      }
    }
  },
  {
    _id: 3,
    calendar_id: 1,
    user_id: 1003,
    status: 'absent',
    isActive: true,
    created_by: 1,
    updated_by: 1,
    created_at: '2025-05-27T08:00:00Z',
    updated_at: '2025-05-27T08:00:00Z',
    classCalendar: {
      _id: 1,
      class_id: 101,
      date: '2025-06-02',
      slot_id: 1,
      room_id: 201,
      coach_id: 301,
      TedTeam_id: 401,
      note: 'Focus on pronunciation and fluency',
      isActive: true,
      created_by: 1,
      updated_by: 1,
      created_at: '2025-05-20T08:00:00Z',
      updated_at: '2025-05-20T08:00:00Z',
      classes: {
        _id: 101,
        name: "IELTS Speaking Intensive",
        schedule: "Mon, Wed, Fri - 07:30-09:30",
        room_id: 201,
        members: 15,
        isActive: true,
        created_by: 1,
        updated_by: 1,
        created_at: '2025-05-15T08:00:00Z',
        updated_at: '2025-05-20T08:00:00Z'
      }
    }
  },
  {
    _id: 4,
    calendar_id: 2,
    user_id: 1004,
    status: 'present',
    isActive: true,
    created_by: 1,
    updated_by: 1,
    created_at: '2025-05-27T08:00:00Z',
    updated_at: '2025-05-27T08:00:00Z',
    classCalendar: {
      _id: 2,
      class_id: 102,
      date: '2025-06-02',
      slot_id: 2,
      room_id: 202,
      coach_id: 302,
      TedTeam_id: 402,
      note: 'Bring writing samples for review',
      isActive: true,
      created_by: 1,
      updated_by: 1,
      created_at: '2025-05-20T08:00:00Z',
      updated_at: '2025-05-20T08:00:00Z',
      classes: {
        _id: 102,
        name: "IELTS Writing Mastery",
        schedule: "Tue, Thu - 09:45-11:45",
        room_id: 202,
        members: 12,
        isActive: true,
        created_by: 1,
        updated_by: 1,
        created_at: '2025-05-15T08:00:00Z',
        updated_at: '2025-05-20T08:00:00Z'
      }
    }
  },
  {
    _id: 5,
    calendar_id: 2,
    user_id: 1005,
    status: 'present',
    isActive: true,
    created_by: 1,
    updated_by: 1,
    created_at: '2025-05-27T08:00:00Z',
    updated_at: '2025-05-27T08:00:00Z',
    classCalendar: {
      _id: 2,
      class_id: 102,
      date: '2025-06-02',
      slot_id: 2,
      room_id: 202,
      coach_id: 302,
      TedTeam_id: 402,
      note: 'Bring writing samples for review',
      isActive: true,
      created_by: 1,
      updated_by: 1,
      created_at: '2025-05-20T08:00:00Z',
      updated_at: '2025-05-20T08:00:00Z',
      classes: {
        _id: 102,
        name: "IELTS Writing Mastery",
        schedule: "Tue, Thu - 09:45-11:45",
        room_id: 202,
        members: 12,
        isActive: true,
        created_by: 1,
        updated_by: 1,
        created_at: '2025-05-15T08:00:00Z',
        updated_at: '2025-05-20T08:00:00Z'
      }
    }
  },
  {
    _id: 6,
    calendar_id: 3,
    user_id: 1004,
    status: 'absent',
    isActive: true,
    created_by: 1,
    updated_by: 1,
    created_at: '2025-05-27T08:00:00Z',
    updated_at: '2025-05-27T08:00:00Z',
    classCalendar: {
      _id: 3,
      class_id: 102,
      date: '2025-06-03',
      slot_id: 2,
      room_id: 202,
      coach_id: 302,
      TedTeam_id: 402,
      note: 'Writing Task 1 practice session',
      isActive: true,
      created_by: 1,
      updated_by: 1,
      created_at: '2025-05-20T08:00:00Z',
      updated_at: '2025-05-20T08:00:00Z',
      classes: {
        _id: 102,
        name: "IELTS Writing Mastery",
        schedule: "Tue, Thu - 09:45-11:45",
        room_id: 202,
        members: 12,
        isActive: true,
        created_by: 1,
        updated_by: 1,
        created_at: '2025-05-15T08:00:00Z',
        updated_at: '2025-05-20T08:00:00Z'
      }
    }
  },
  {
    _id: 7,
    calendar_id: 3,
    user_id: 1005,
    status: 'present',
    isActive: true,
    created_by: 1,
    updated_by: 1,
    created_at: '2025-05-27T08:00:00Z',
    updated_at: '2025-05-27T08:00:00Z',
    classCalendar: {
      _id: 3,
      class_id: 102,
      date: '2025-06-03',
      slot_id: 2,
      room_id: 202,
      coach_id: 302,
      TedTeam_id: 402,
      note: 'Writing Task 1 practice session',
      isActive: true,
      created_by: 1,
      updated_by: 1,
      created_at: '2025-05-20T08:00:00Z',
      updated_at: '2025-05-20T08:00:00Z',
      classes: {
        _id: 102,
        name: "IELTS Writing Mastery",
        schedule: "Tue, Thu - 09:45-11:45",
        room_id: 202,
        members: 12,
        isActive: true,
        created_by: 1,
        updated_by: 1,
        created_at: '2025-05-15T08:00:00Z',
        updated_at: '2025-05-20T08:00:00Z'
      }
    }
  },
  {
    _id: 8,
    calendar_id: 4,
    user_id: 1006,
    status: 'not yet',
    isActive: true,
    created_by: 1,
    updated_by: 1,
    created_at: '2025-05-27T08:00:00Z',
    updated_at: '2025-05-27T08:00:00Z',
    classCalendar: {
      _id: 4,
      class_id: 103,
      date: '2025-06-04',
      slot_id: 3,
      room_id: 203,
      coach_id: 303,
      TedTeam_id: 403,
      note: 'Audio equipment needed for listening practice',
      isActive: true,
      created_by: 1,
      updated_by: 1,
      created_at: '2025-05-20T08:00:00Z',
      updated_at: '2025-05-20T08:00:00Z',classes: {
        _id: 103,
        name: "IELTS Listening Focus",
        schedule: "Wed - 12:00-14:00",
        room_id: 203,
        members: 18,
        isActive: true,
        created_by: 1,
        updated_by: 1,
        created_at: '2025-05-15T08:00:00Z',
        updated_at: '2025-05-20T08:00:00Z'
      }
    }
  },
  {
    _id: 9,
    calendar_id: 4,
    user_id: 1007,
    status: 'not yet',
    isActive: true,
    created_by: 1,
    updated_by: 1,
    created_at: '2025-05-27T08:00:00Z',
    updated_at: '2025-05-27T08:00:00Z',
    classCalendar: {
      _id: 4,
      class_id: 103,
      date: '2025-06-04',
      slot_id: 3,
      room_id: 203,
      coach_id: 303,
      TedTeam_id: 403,
      note: 'Audio equipment needed for listening practice',
      isActive: true,
      created_by: 1,
      updated_by: 1,
      created_at: '2025-05-20T08:00:00Z',
      updated_at: '2025-05-20T08:00:00Z',
      classes: {
        _id: 103,
        name: "IELTS Listening Focus",
        schedule: "Wed - 12:00-14:00",
        room_id: 203,
        members: 18,
        isActive: true,
        created_by: 1,
        updated_by: 1,
        created_at: '2025-05-15T08:00:00Z',
        updated_at: '2025-05-20T08:00:00Z'
      }
    }
  },
  {
    _id: 10,
    calendar_id: 5,
    user_id: 1008,
    status: 'not yet',
    isActive: true,
    created_by: 1,
    updated_by: 1,
    created_at: '2025-05-27T08:00:00Z',
    updated_at: '2025-05-27T08:00:00Z',
    classCalendar: {
      _id: 5,
      class_id: 104,
      date: '2025-06-05',
      slot_id: 4,
      room_id: 204,
      coach_id: 304,
      TedTeam_id: 404,
      note: 'Practice materials provided for reading comprehension',
      isActive: true,
      created_by: 1,
      updated_by: 1,
      created_at: '2025-05-20T08:00:00Z',
      updated_at: '2025-05-20T08:00:00Z',
      classes: {
        _id: 104,
        name: "IELTS Reading Comprehension",
        schedule: "Thu - 14:15-16:15",
        room_id: 204,
        members: 14,
        isActive: true,
        created_by: 1,
        updated_by: 1,
        created_at: '2025-05-15T08:00:00Z',
        updated_at: '2025-05-20T08:00:00Z'
      }
    }
  },
  {
    _id: 11,
    calendar_id: 5,
    user_id: 1009,
    status: 'not yet',
    isActive: true,
    created_by: 1,
    updated_by: 1,
    created_at: '2025-05-27T08:00:00Z',
    updated_at: '2025-05-27T08:00:00Z',
    classCalendar: {
      _id: 5,
      class_id: 104,
      date: '2025-06-05',
      slot_id: 4,
      room_id: 204,
      coach_id: 304,
      TedTeam_id: 404,
      note: 'Practice materials provided for reading comprehension',
      isActive: true,
      created_by: 1,
      updated_by: 1,
      created_at: '2025-05-20T08:00:00Z',
      updated_at: '2025-05-20T08:00:00Z',
      classes: {
        _id: 104,
        name: "IELTS Reading Comprehension",
        schedule: "Thu - 14:15-16:15",
        room_id: 204,
        members: 14,
        isActive: true,
        created_by: 1,
        updated_by: 1,
        created_at: '2025-05-15T08:00:00Z',
        updated_at: '2025-05-20T08:00:00Z'
      }
    }
  },
  {
    _id: 12,
    calendar_id: 6,
    user_id: 1010,
    status: 'not yet',
    isActive: true,
    created_by: 1,
    updated_by: 1,
    created_at: '2025-05-27T08:00:00Z',
    updated_at: '2025-05-27T08:00:00Z',
    classCalendar: {
      _id: 6,
      class_id: 105,
      date: '2025-06-06',
      slot_id: 1,
      room_id: 205,
      coach_id: 305,
      TedTeam_id: 405,
      note: 'Essay topic will be announced at the beginning',
      isActive: true,
      created_by: 1,
      updated_by: 1,
      created_at: '2025-05-20T08:00:00Z',
      updated_at: '2025-05-20T08:00:00Z',
      classes: {
        _id: 105,
        name: "IELTS Essay Writing Workshop",
        schedule: "Fri - 07:30-09:30",
        room_id: 205,
        members: 16,
        isActive: true,
        created_by: 1,
        updated_by: 1,
        created_at: '2025-05-15T08:00:00Z',
        updated_at: '2025-05-20T08:00:00Z'
      }
    }
  }
];
 
