export interface StudentData {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  class?: {
    class_id: number;
    name: string;
  };
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  role: 'student' | 'tedTeam' | 'coach' | 'admin';
}

export const StudentSampleData: StudentData[] = [
  {
    id: 1,
    name: 'Nguyen Van A (student)',
    email: 'nguyenvana@example.com',
    isActive: true,
    class: {
      class_id: 1,
      name: 'SE18D03',
    },
    createdAt: '2024-06-01T10:00:00Z',
    createdBy: 'admin',
    updatedAt: '2024-06-01T10:00:00Z',
    updatedBy: 'admin',
    role: 'student',
  },
  {
    id: 2,
    name: 'Tran Thi B',
    email: 'tranthib@example.com',
    isActive: true,
    class: {
      class_id: 1,
      name: 'SE18D03',
    },
    createdAt: '2024-06-01T10:00:00Z',
    createdBy: 'admin',
    updatedAt: '2024-06-01T10:00:00Z',
    updatedBy: 'admin',
    role: 'student',
  },
  {
    id: 3,
    name: 'Le Van C',
    email: 'levanc@example.com',
    isActive: false,
    class: {
      class_id: 1,
      name: 'SE18D03',
    },
    createdAt: '2024-06-01T10:00:00Z',
    createdBy: 'admin',
    updatedAt: '2024-06-01T10:00:00Z',
    updatedBy: 'admin',
    role: 'student',
  },
  {
    id: 4,
    name: 'Pham Thi D',
    email: 'phamthid@example.com',
    isActive: false,
    class: {
      class_id: 2,
      name: 'SE18D04',
    },
    createdAt: '2024-06-01T10:00:00Z',
    createdBy: 'admin',
    updatedAt: '2024-06-01T10:00:00Z',
    updatedBy: 'admin',
    role: 'student',
  },
  {
    id: 5,
    name: 'Hoang Van E',
    email: 'hoangvane@example.com',
    isActive: true,
    class: {
      class_id: 2,
      name: 'SE18D04',
    },
    createdAt: '2024-06-01T10:00:00Z',
    createdBy: 'admin',
    updatedAt: '2024-06-01T10:00:00Z',
    updatedBy: 'admin',
    role: 'student',
  },
  {
    id: 6,
    name: 'Vu Thi F',
    email: 'vuthif@example.com',
    isActive: false,
    class: {
      class_id: 2,
      name: 'SE18D04',
    },
    createdAt: '2024-06-01T10:00:00Z',
    createdBy: 'admin',
    updatedAt: '2024-06-01T10:00:00Z',
    updatedBy: 'admin',
    role: 'student',
  },
  {
    id: 7,
    name: 'Do Van G',
    email: 'dovang@example.com',
    isActive: false,
    class: {
      class_id: 3,
      name: 'SE18D05',
    },
    createdAt: '2024-06-01T10:00:00Z',
    createdBy: 'admin',
    updatedAt: '2024-06-01T10:00:00Z',
    updatedBy: 'admin',
    role: 'student',
  },
  {
    id: 8,
    name: 'Nguyen Thi H',
    email: 'nguyentih@example.com',
    isActive: true,
    class: {
      class_id: 3,
      name: 'SE18D05',
    },
    createdAt: '2024-06-01T10:00:00Z',
    createdBy: 'admin',
    updatedAt: '2024-06-01T10:00:00Z',
    updatedBy: 'admin',
    role: 'student',
  },
  {
    id: 9,
    name: 'Bui Van I',
    email: 'buivani@example.com',
    isActive: true,
    class: {
      class_id: 3,
      name: 'SE18D05',
    },
    createdAt: '2024-06-01T10:00:00Z',
    createdBy: 'admin',
    updatedAt: '2024-06-01T10:00:00Z',
    updatedBy: 'admin',
    role: 'student',
  },
  {
    id: 10,
    name: 'Pham Thi J',
    email: 'phamthij@example.com',
    isActive: true,
    class: {
      class_id: 4,
      name: 'SE18D06',
    },
    createdAt: '2024-06-01T10:00:00Z',
    createdBy: 'admin',
    updatedAt: '2024-06-01T10:00:00Z',
    updatedBy: 'admin',
    role: 'student',
  },
  {
    id: 11,
    name: 'Le Van K',
    email: 'levank@example.com',
    isActive: true,
    class: {
      class_id: 4,
      name: 'SE18D06',
    },
    createdAt: '2024-06-01T10:00:00Z',
    createdBy: 'admin',
    updatedAt: '2024-06-01T10:00:00Z',
    updatedBy: 'admin',
    role: 'student',
  },
  {
    id: 12,
    name: 'Tran Thi L',
    email: 'tranthil@example.com',
    isActive: true,
    class: {
      class_id: 4,
      name: 'SE18D06',
    },
    createdAt: '2024-06-01T10:00:00Z',
    createdBy: 'admin',
    updatedAt: '2024-06-01T10:00:00Z',
    updatedBy: 'admin',
    role: 'student',
  },
  {
    id: 13,
    name: 'Nguyen Van M',
    email: 'nguyenvanm@example.com',
    isActive: true,
    class: {
      class_id: 5,
      name: 'SE18D07',
    },
    createdAt: '2024-06-01T10:00:00Z',
    createdBy: 'admin',
    updatedAt: '2024-06-01T10:00:00Z',
    updatedBy: 'admin',
    role: 'student',
  },
  {
    id: 14,
    name: 'Hoang Thi N',
    email: 'hoangthin@example.com',
    isActive: true,
    class: {
      class_id: 5,
      name: 'SE18D07',
    },
    createdAt: '2024-06-01T10:00:00Z',
    createdBy: 'admin',
    updatedAt: '2024-06-01T10:00:00Z',
    updatedBy: 'admin',
    role: 'student',
  },
  {
    id: 15,
    name: 'Vu Van O',
    email: 'vuvano@example.com',
    isActive: true,
    class: {
      class_id: 5,
      name: 'SE18D07',
    },
    createdAt: '2024-06-01T10:00:00Z',
    createdBy: 'admin',
    updatedAt: '2024-06-01T10:00:00Z',
    updatedBy: 'admin',
    role: 'student',
  },
];