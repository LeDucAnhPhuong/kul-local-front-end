export interface ClassSlotData {
  _id: number; 
  class_id: number;
  date: Date; 
  slot_id: number; 
  room_id: number;
  coach_id: number;
  TedTeam_id: number;
  note: string;
  isActive: boolean;
  created_by: number;
  updated_by: number;
  created_at: Date;
  updated_at: Date;
  slot: {
    _id: number; 
    name: string; 
    start_time: string; 
    end_time: string; 
    description: string;
    isActive: boolean;
    created_by: number;
    updated_by: number;
    created_at: Date;
    updated_at: Date;
  };
  topic: string;
  instructor: string;
  status: 'not yet' | 'present' | 'absent';
}

export const classSlotSampleData: ClassSlotData[] = [
  
  {
    _id: 1,
    class_id: 101,
    date: new Date('2025-06-02'),
    slot_id: 1,
    room_id: 201,
    coach_id: 301,
    TedTeam_id: 401,
    note: 'Focus on pronunciation and fluency',
    isActive: true,
    created_by: 1,
    updated_by: 1,
    created_at: new Date('2025-05-20T08:00:00Z'),
    updated_at: new Date('2025-05-20T08:00:00Z'),
    slot: {
      _id: 1,
      name: 'Slot 1',
      start_time: '07:30:00',
      end_time: '09:30:00',
      description: 'Early morning intensive session',
      isActive: true,
      created_by: 1,
      updated_by: 1,
      created_at: new Date('2025-05-15T08:00:00Z'),
      updated_at: new Date('2025-05-15T08:00:00Z')
    },
    topic: 'Speaking Part 1',
    instructor: 'John Smith',
    status: 'present'
  },
 
  {
    _id: 2,
    class_id: 102,
    date: new Date('2025-06-02'),
    slot_id: 2,
    room_id: 202,
    coach_id: 302,
    TedTeam_id: 402,
    note: 'Bring writing samples for review',
    isActive: true,
    created_by: 1,
    updated_by: 1,
    created_at: new Date('2025-05-20T08:00:00Z'),
    updated_at: new Date('2025-05-20T08:00:00Z'),
    slot: {
      _id: 2,
      name: 'Slot 2',
      start_time: '09:45:00',
      end_time: '11:45:00',
      description: 'Mid-morning focused session',
      isActive: true,
      created_by: 1,
      updated_by: 1,
      created_at: new Date('2025-05-15T08:00:00Z'),
      updated_at: new Date('2025-05-15T08:00:00Z')
    },
    topic: 'Writing Task 1',
    instructor: 'Emily Johnson',
    status: 'present'
  },
  {
    _id: 2,
    class_id: 102,
    date: new Date('2025-06-03'),
    slot_id: 2,
    room_id: 202,
    coach_id: 302,
    TedTeam_id: 402,
    note: 'Bring writing samples for review',
    isActive: true,
    created_by: 1,
    updated_by: 1,
    created_at: new Date('2025-05-20T08:00:00Z'),
    updated_at: new Date('2025-05-20T08:00:00Z'),
    slot: {
      _id: 2,
      name: 'Slot 2',
      start_time: '09:45:00',
      end_time: '11:45:00',
      description: 'Mid-morning focused session',
      isActive: true,
      created_by: 1,
      updated_by: 1,
      created_at: new Date('2025-05-15T08:00:00Z'),
      updated_at: new Date('2025-05-15T08:00:00Z')
    },
    topic: 'Writing Task 1',
    instructor: 'Emily Johnson',
    status: 'absent'
  },
  {
    _id: 3,
    class_id: 103,
    date: new Date('2025-06-03'),
    slot_id: 3,
    room_id: 203,
    coach_id: 303,
    TedTeam_id: 403,
    note: 'Audio equipment needed',
    isActive: true,
    created_by: 1,
    updated_by: 1,
    created_at: new Date('2025-05-20T08:00:00Z'),
    updated_at: new Date('2025-05-20T08:00:00Z'),
    slot: {
      _id: 3,
      name: 'Slot 3',
      start_time: '12:00:00',
      end_time: '14:00:00',
      description: 'Post-lunch afternoon session',
      isActive: true,
      created_by: 1,
      updated_by: 1,
      created_at: new Date('2025-05-15T08:00:00Z'),
      updated_at: new Date('2025-05-15T08:00:00Z')
    },
    topic: 'Listening Strategies',
    instructor: 'Michael Brown',
    status: 'absent'
  },
  // Thứ Năm
  {
    _id: 4,
    class_id: 104,
    date: new Date('2025-06-04'),
    slot_id: 4,
    room_id: 204,
    coach_id: 304,
    TedTeam_id: 404,
    note: 'Practice materials provided',
    isActive: true,
    created_by: 1,
    updated_by: 1,
    created_at: new Date('2025-05-20T08:00:00Z'),
    updated_at: new Date('2025-05-20T08:00:00Z'),
    slot: {
      _id: 4,
      name: 'Slot 4',
      start_time: '14:15:00',
      end_time: '16:15:00',
      description: 'Late afternoon intensive session',
      isActive: true,
      created_by: 1,
      updated_by: 1,
      created_at: new Date('2025-05-15T08:00:00Z'),
      updated_at: new Date('2025-05-15T08:00:00Z')
    },
    topic: 'Reading Comprehension',
    instructor: 'Sarah Davis',
    status: 'not yet'
  },
  // Thứ Sáu
  {
    _id: 5,
    class_id: 105,
    date: new Date('2025-06-05'),
    slot_id: 1,
    room_id: 205,
    coach_id: 305,
    TedTeam_id: 405,
    note: 'Essay topic will be announced',
    isActive: true,
    created_by: 1,
    updated_by: 1,
    created_at: new Date('2025-05-20T08:00:00Z'),
    updated_at: new Date('2025-05-20T08:00:00Z'),
    slot: {
      _id: 1,
      name: 'Slot 1',
      start_time: '07:30:00',
      end_time: '09:30:00',
      description: 'Early morning intensive session',
      isActive: true,
      created_by: 1,
      updated_by: 1,
      created_at: new Date('2025-05-15T08:00:00Z'),
      updated_at: new Date('2025-05-15T08:00:00Z')
    },
    topic: 'Essay Writing Techniques',
    instructor: 'David Wilson',
    status: 'not yet'
  },
  // Thứ Bảy
  {
    _id: 6,
    class_id: 106,
    date: new Date('2025-06-06'),
    slot_id: 2,
    room_id: 206,
    coach_id: 306,
    TedTeam_id: 406,
    note: 'Individual feedback session',
    isActive: true,
    created_by: 1,
    updated_by: 1,
    created_at: new Date('2025-05-20T08:00:00Z'),
    updated_at: new Date('2025-05-20T08:00:00Z'),
    slot: {
      _id: 2,
      name: 'Slot 2',
      start_time: '09:45:00',
      end_time: '11:45:00',
      description: 'Mid-morning focused session',
      isActive: true,
      created_by: 1,
      updated_by: 1,
      created_at: new Date('2025-05-15T08:00:00Z'),
      updated_at: new Date('2025-05-15T08:00:00Z')
    },
    topic: 'Mock Speaking Test',
    instructor: 'Linda Martinez',
    status: 'not yet'
  },
  // Chủ Nhật
  {
    _id: 7,
    class_id: 107,
    date: new Date('2025-06-07'),
    slot_id: 3,
    room_id: 207,
    coach_id: 307,
    TedTeam_id: 407,
    note: 'Comprehensive grammar review',
    isActive: true,
    created_by: 1,
    updated_by: 1,
    created_at: new Date('2025-05-20T08:00:00Z'),
    updated_at: new Date('2025-05-20T08:00:00Z'),
    slot: {
      _id: 3,
      name: 'Slot 3',
      start_time: '12:00:00',
      end_time: '14:00:00',
      description: 'Post-lunch afternoon session',
      isActive: true,
      created_by: 1,
      updated_by: 1,
      created_at: new Date('2025-05-15T08:00:00Z'),
      updated_at: new Date('2025-05-15T08:00:00Z')
    },
    topic: 'Grammar Review',
    instructor: 'James Taylor',
    status: 'not yet'
  }
];

