import type { SlotSchedule } from './columns/schedule.columns';


export const exampleScheduelData: SlotSchedule[] = [
  {
    slot: 'Slot 1',
    Mon: {
      courseCode: 'CS101',
      location: 'Room A',
      time: '10:00 AM - 12:00 PM',
      meetUrl: 'https://meet.example.com/slot1-Mon',
      eduNextUrl: 'https://edunext.example.com/slot1-Mon',
    },
    Tue: {
      courseCode: 'CS102',
      location: 'Room B',
      time: '1:00 PM - 3:00 PM',
    },
    Wed: {
      courseCode: 'CS103',
      location: 'Room C',
      time: '9:00 AM - 11:00 AM',
    },
    Thu: {
      courseCode: 'CS104',
      location: 'Room D',
      time: '2:00 PM - 4:00 PM',
    },
    Fri: {
      courseCode: 'CS105',
      location: 'Room E',
      time: '11:00 AM - 1:00 PM',
    },
  },
  {
    slot: 'Slot 2',
    Mon: {
      courseCode: 'CS201',
      location: 'Room F',
      time: '10:00 AM - 12:00 PM',
    },
    Tue: {
      courseCode: 'CS202',
      location: 'Room G',
      time: '1:00 PM - 3:00 PM',
    },
    Wed: {
      courseCode: 'CS203',
      location: 'Room H',
      time: '9:00 AM - 11:00 AM',
    },
    Thu: {
      courseCode: 'CS204',
      location: 'Room I',
      time: '2:00 PM - 4:00 PM',
    },
  },
  {
    slot: 'Slot 3',
    Mon: {
      courseCode: 'CS301',
      location: 'Room J',
      time: '10:00 AM - 12:00 PM',
    },
    Tue: {
      courseCode: 'CS302',
      location: 'Room K',
      time: '1:00 PM - 3:00 PM',
    },
    Wed: {
      courseCode: 'CS303',
      location: 'Room L',
      time: '9:00 AM - 11:00 AM',
    },
  },
];
