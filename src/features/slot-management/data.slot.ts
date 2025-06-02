export interface SlotData {
  id: number;
  name: string;
  description?: string;
  start_time: string;
  end_time: string;
  isActive: boolean;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
}

export const SlotSampleData: SlotData[] = [
    {
        id: 1,
        name: 'Morning Slot',
        description: 'Morning slot for classes',
        start_time: '2024-06-01T08:00:00',
        end_time: '2024-06-01T11:00:00',
        isActive: true,
    },
    {
        id: 2,
        name: 'Afternoon Slot',
        description: 'Afternoon slot for classes',
        start_time: '2024-06-01T12:00:00',
        end_time: '2024-06-01T16:00:00',
        isActive: true,
    },
    {
        id: 3,
        name: 'Evening Slot',
        description: 'Evening slot for classes',
        start_time: '2024-06-01T17:00:00',
        end_time: '2024-06-01T19:00:00',
        isActive: false,
    },
    {
        id: 4,
        name: 'Night Slot',
        description: 'Night slot for classes',
        start_time: '2024-06-01T19:30:00',
        end_time: '2024-06-01T21:30:00',
        isActive: true,
    },
    {
        id: 5,
        name: 'Late Night Slot',
        description: 'Late night slot for classes',
        start_time: '2024-06-01T22:00:00',
        end_time: '2024-06-01T23:30:00',
        isActive: false,
    },
];
