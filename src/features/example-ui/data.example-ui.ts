import type { SlotSchedule } from './columns/schedule.comlumns';

export interface ExampleUiData {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export const exampleUiSampleData: ExampleUiData[] = [
  {
    id: 1,
    name: 'Nguyen Van A',
    email: 'nguyenvana@example.com',
    status: 'active',
    createdAt: '2024-06-01T10:00:00Z',
  },
  {
    id: 2,
    name: 'Tran Thi B',
    email: 'tranthib@example.com',
    status: 'inactive',
    createdAt: '2024-06-02T11:30:00Z',
  },
  {
    id: 3,
    name: 'Le Van C',
    email: 'levanc@example.com',
    status: 'active',
    createdAt: '2024-06-03T09:15:00Z',
  },
  {
    id: 4,
    name: 'Pham Thi D',
    email: 'phamthid@example.com',
    status: 'inactive',
    createdAt: '2024-06-04T14:20:00Z',
  },
  {
    id: 5,
    name: 'Hoang Van E',
    email: 'hoangvane@example.com',
    status: 'active',
    createdAt: '2024-06-05T08:45:00Z',
  },
  {
    id: 6,
    name: 'Vu Thi F',
    email: 'vuthif@example.com',
    status: 'inactive',
    createdAt: '2024-06-06T16:10:00Z',
  },
  {
    id: 7,
    name: 'Do Van G',
    email: 'dovang@example.com',
    status: 'active',
    createdAt: '2024-06-07T12:00:00Z',
  },
  {
    id: 8,
    name: 'Bui Thi H',
    email: 'buithih@example.com',
    status: 'inactive',
    createdAt: '2024-06-08T13:30:00Z',
  },
  {
    id: 9,
    name: 'Nguyen Van I',
    email: 'nguyenvani@example.com',
    status: 'active',
    createdAt: '2024-06-09T15:25:00Z',
  },
  {
    id: 10,
    name: 'Tran Thi K',
    email: 'tranthik@example.com',
    status: 'inactive',
    createdAt: '2024-06-10T17:40:00Z',
  },
  {
    id: 11,
    name: 'Le Van L',
    email: 'levanl@example.com',
    status: 'active',
    createdAt: '2024-06-11T09:00:00Z',
  },
  {
    id: 12,
    name: 'Pham Thi M',
    email: 'phamthim@example.com',
    status: 'inactive',
    createdAt: '2024-06-12T10:20:00Z',
  },
  {
    id: 13,
    name: 'Hoang Van N',
    email: 'hoangvann@example.com',
    status: 'active',
    createdAt: '2024-06-13T11:45:00Z',
  },
  {
    id: 14,
    name: 'Vu Thi O',
    email: 'vuthio@example.com',
    status: 'inactive',
    createdAt: '2024-06-14T13:10:00Z',
  },
  {
    id: 15,
    name: 'Do Van P',
    email: 'dovanp@example.com',
    status: 'active',
    createdAt: '2024-06-15T14:35:00Z',
  },
  {
    id: 16,
    name: 'Bui Thi Q',
    email: 'buithiq@example.com',
    status: 'inactive',
    createdAt: '2024-06-16T16:00:00Z',
  },
  {
    id: 17,
    name: 'Nguyen Van R',
    email: 'nguyenvanr@example.com',
    status: 'active',
    createdAt: '2024-06-17T17:25:00Z',
  },
  {
    id: 18,
    name: 'Tran Thi S',
    email: 'tranthis@example.com',
    status: 'inactive',
    createdAt: '2024-06-18T18:50:00Z',
  },
  {
    id: 19,
    name: 'Le Van T',
    email: 'levant@example.com',
    status: 'active',
    createdAt: '2024-06-19T20:15:00Z',
  },
  {
    id: 20,
    name: 'Pham Thi U',
    email: 'phamthiu@example.com',
    status: 'inactive',
    createdAt: '2024-06-20T21:40:00Z',
  },
];

export const exampleScheduelData: SlotSchedule[] = [
  {
    slot: 'Slot 1',
    t2: {
      courseCode: 'CS101',
      location: 'Room A',
      time: '10:00 AM - 12:00 PM',
      status: 'Not yet',
      meetUrl: 'https://meet.example.com/slot1-t2',
      eduNextUrl: 'https://edunext.example.com/slot1-t2',
    },
    t3: {
      courseCode: 'CS102',
      location: 'Room B',
      time: '1:00 PM - 3:00 PM',
      status: 'Completed',
    },
    t4: {
      courseCode: 'CS103',
      location: 'Room C',
      time: '9:00 AM - 11:00 AM',
      status: 'Not yet',
    },
    t5: {
      courseCode: 'CS104',
      location: 'Room D',
      time: '2:00 PM - 4:00 PM',
      status: 'Completed',
    },
    t6: {
      courseCode: 'CS105',
      location: 'Room E',
      time: '11:00 AM - 1:00 PM',
      status: 'Not yet',
    },
  },
  {
    slot: 'Slot 2',
    t2: {
      courseCode: 'CS201',
      location: 'Room F',
      time: '10:00 AM - 12:00 PM',
      status: 'Completed',
    },
    t3: {
      courseCode: 'CS202',
      location: 'Room G',
      time: '1:00 PM - 3:00 PM',
      status: 'Not yet',
    },
    t4: {
      courseCode: 'CS203',
      location: 'Room H',
      time: '9:00 AM - 11:00 AM',
      status: 'Completed',
    },
    t5: {
      courseCode: 'CS204',
      location: 'Room I',
      time: '2:00 PM - 4:00 PM',
      status: 'Not yet',
    },
  },
  {
    slot: 'Slot 3',
    t2: {
      courseCode: 'CS301',
      location: 'Room J',
      time: '10:00 AM - 12:00 PM',
      status: 'Not yet',
    },
    t5: {
      courseCode: 'CS302',
      location: 'Room K',
      time: '1:00 PM - 3:00 PM',
      status: 'Completed',
    },
    cn: {
      courseCode: 'CS303',
      location: 'Room L',
      time: '9:00 AM - 11:00 AM',
      status: 'Not yet',
    },
  },
];
