export type Quiz = {
  title: string;
  date: string;
  due: string;
  isPublic: boolean;
  createdBy: string;
  id: string;
  level: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  updatedBy: string;
  status: 'ongoing' | 'upcoming' | 'completed';
};
