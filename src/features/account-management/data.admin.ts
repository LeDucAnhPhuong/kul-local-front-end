export interface AdminData {
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

export const AdminSampleData: AdminData[] = [
  {
    id: 1,
    name: 'admin',
    email: 'admin@example.com',
    isActive: true,
    createdAt: '2024-06-01T10:00:00Z',
    createdBy: 'admin',
    updatedAt: '2024-06-01T10:00:00Z',
    updatedBy: 'admin',
    role: 'admin',
  },
  {
    id: 2,
    name: 'Tran Thi B',
    email: 'tranthib@example.com',
    isActive: true,
    createdAt: '2024-06-01T10:00:00Z',
    createdBy: 'admin',
    updatedAt: '2024-06-01T10:00:00Z',
    updatedBy: 'admin',
    role: 'admin',
  },
  {
    id: 3,
    name: 'Le Van C',
    email: 'levanc@example.com',
    isActive: false,
    createdAt: '2024-06-01T10:00:00Z',
    createdBy: 'admin',
    updatedAt: '2024-06-01T10:00:00Z',
    updatedBy: 'admin',
    role: 'admin',
  },
  {
    id: 4,
    name: 'Pham Thi D',
    email: 'phamthid@example.com',
    isActive: false,
    createdAt: '2024-06-01T10:00:00Z',
    createdBy: 'admin',
    updatedAt: '2024-06-01T10:00:00Z',
    updatedBy: 'admin',
    role: 'admin',
  },
  {
    id: 5,
    name: 'Hoang Van E',
    email: 'hoangvane@example.com',
    isActive: true,
    createdAt: '2024-06-01T10:00:00Z',
    createdBy: 'admin',
    updatedAt: '2024-06-01T10:00:00Z',
    updatedBy: 'admin',
    role: 'admin',
  },
];
