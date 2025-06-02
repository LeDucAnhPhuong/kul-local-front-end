export interface ClassData {
  id: number;
  name: string;
  members?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    isActive: boolean;
    class?: {
      class_id: number;
      name: string;
    };
    created_at?: string;
    created_by?: string;
    updated_at?: string;
    updated_by?: string;
    role: 'Student' | 'TedTeam' | 'Coach' | 'Admin';
  }[];
  isActive: boolean;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export const ClassSampleData: ClassData[] = [
  {
    id: 1,
    name: 'Class A',
    members: [
      {
        id: 1,
        first_name: 'Nguyen',
        last_name: 'Van A',
        email: 'lop1@gmail.com',
        isActive: true,
        role: 'Student',
      },
      {
        id: 2,
        first_name: 'Tran',
        last_name: 'Thi B',
        email: 'tranthib@gmail.com',
        isActive: true,
        role: 'Student',
      },
      {
        id: 3,
        first_name: 'Le',
        last_name: 'Van C',
        email: 'levanc@gmail.com',
        isActive: false,
        role: 'Student',
      },
    ],
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'Class B',
    members: [
      {
        id: 6,
        first_name: 'Nguyen',
        last_name: 'Van F',
        email: 'lop2@gmail.com',
        isActive: true,
        role: 'Student',
      },
      {
        id: 10,
        first_name: 'Le',
        last_name: 'Thi G',
        email: 'lethig@gmail.com',
        isActive: true,
        role: 'Student',
      },
      {
        id: 11,
        first_name: 'Nguyen',
        last_name: 'Van H',
        email: 'nguyenvanh@gmail.com',
        isActive: true,
        role: 'Student',
      },
    ],
    isActive: false,
  },
  {
    id: 3,
    name: 'Class C',
    members: [
      {
        id: 7,
        first_name: 'Tran',
        last_name: 'Thi G',
        email: 'lop3@gmail.com',
        isActive: true,
        role: 'Student',
      },
        {
            id: 12,
            first_name: 'Pham',
            last_name: 'Van I',
            email: 'phamvani@gmail.com',
            isActive: true,
            role: 'Student',
        },
        { id: 13,
            first_name: 'Hoang',
            last_name: 'Van J',
            email: 'hoangvanj@gmail.com',
            isActive: true,
            role: 'Student',
        },
    ],
    isActive: true,
  },
  {
    id: 4,
    name: 'Class D',
    members: [
      {
        id: 8,
        first_name: 'Le',
        last_name: 'Van H',
        email: 'lop4@gmail.com',
        isActive: true,
        role: 'Student',
      },
      {
        id: 4,
        first_name: 'Pham',
        last_name: 'Thi D',
        email: 'phamthid@gmail.com',
        isActive: false,
        role: 'Student',
      },
      {
        id: 5,
        first_name: 'Hoang',
        last_name: 'Van E',
        email: 'hoangvane@gmail.com',
        isActive: true,
        role: 'Student',
      },
    ],
    isActive: true,
  },
  {
    id: 5,
    name: 'Class E',
    members: [
      {
        id: 9,
        first_name: 'Pham',
        last_name: 'Thi I',
        email: 'lop5@gmail.com',
        isActive: true,
        role: 'Student',
      },
    ],
    isActive: true,
  },
];
