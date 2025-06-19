export type ClassListView = {
  _id: number;
  name: string;
  email: string;
  isActive: boolean;
  class: {
    class_id: number;
    name: string;
  };
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  role: string;
};

export const classesData: ClassListView[] = [
  {
    _id: 1,
    name: 'Nguyen Van A',
    email: 'nguyen.vana@example.com',
    isActive: true,
    class: {
      class_id: 1,
      name: 'Class 1',
    },
    created_at: '2023-01-01',
    created_by: 'Admin',
    updated_at: '2023-01-01',
    updated_by: 'Admin',
    role: 'Student',
  },
  {
    _id: 2,
    name: 'Tran Van B',
    email: 'tran.vanb@example.com',
    isActive: true,
    class: {
      class_id: 1,
      name: 'Class 1',
    },
    created_at: '2023-01-01',
    created_by: 'Admin',
    updated_at: '2023-01-01',
    updated_by: 'Admin',
    role: 'Student',
  },
  {
    _id: 3,
    name: 'Le Van C',
    email: 'le.vanc@example.com',
    isActive: false,
    class: {
      class_id: 2,
      name: 'Class 2',
    },
    created_at: '2023-01-01',
    created_by: 'Admin',
    updated_at: '2023-01-01',
    updated_by: 'Admin',
    role: 'Student',
  },
  {
    _id: 4,
    name: 'Pham Van D',
    email: 'pham.vand@example.com',
    isActive: true,
    class: {
      class_id: 3,
      name: 'Class 3',
    },
    created_at: '2023-01-01',
    created_by: 'Admin',
    updated_at: '2023-01-01',
    updated_by: 'Admin',
    role: 'Student',
  },
]