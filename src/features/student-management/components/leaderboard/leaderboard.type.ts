export interface LeaderboardEntry {
  user: {
    firstName: string | null;
    lastName: string | null;
    email: string;
    profileImage: string;
  };
  averageScore: number;
  highestScore: number;
  attempts: number;
}

export type TimePeriod = 'week' | 'month' | 'year';