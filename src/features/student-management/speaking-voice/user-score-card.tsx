import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface UserScoreData {
  userId: {
    profileImage: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    classId: string;
    role: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    createdBy: string | null;
    updatedBy: string | null;
    createdByUser: string | null;
    updatedByUser: string | null;
  };
  totalAttempts: number;
  averageScore: number;
  bestScore: number;
  me?: boolean;
  latestScore?: number; // Optional, if not available
}

export const mockLeaderboardData: UserScoreData[] = [
  {
    userId: {
      profileImage: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png',
      email: 'phuonglda.test@gmail.com',
      firstName: null,
      lastName: null,
      classId: '6850e812151f49cf386c5996',
      role: 'Student',
      id: '685b90708065e2f8ba89a093',
      createdAt: '2025-06-25T06:00:16.538Z',
      updatedAt: '2025-06-25T06:00:16.538Z',
      isActive: true,
      createdBy: null,
      updatedBy: null,
      createdByUser: null,
      updatedByUser: null,
    },
    totalAttempts: 5,
    averageScore: 75,
    bestScore: 99,
  },
  // You can add more mock data here to see the leaderboard populate
  {
    userId: {
      profileImage: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png',
      email: 'another.user@example.com',
      firstName: 'Another',
      lastName: 'User',
      classId: '6850e812151f49cf386c5996',
      role: 'Student',
      id: '685b90708065e2f8ba89a094',
      createdAt: '2025-06-24T06:00:16.538Z',
      updatedAt: '2025-06-24T06:00:16.538Z',
      isActive: true,
      createdBy: null,
      updatedBy: null,
      createdByUser: null,
      updatedByUser: null,
    },
    totalAttempts: 10,
    averageScore: 80,
    bestScore: 95,
  },
];

interface UserScoreCardsProps {
  currentUserData: UserScoreData | undefined;
}

export function UserScoreCards({ currentUserData }: UserScoreCardsProps) {
  if (!currentUserData) {
    return (
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">N/A</div>
            <p className="text-xs text-muted-foreground">No data available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">N/A</div>
            <p className="text-xs text-muted-foreground">No data available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">N/A</div>
            <p className="text-xs text-muted-foreground">No data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Latest Score</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Using averageScore as a placeholder for "latest" since no specific latest attempt timestamp is available */}
          <div className="text-2xl font-bold">{currentUserData.averageScore}</div>
          <p className="text-xs text-muted-foreground">Based on your average performance</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentUserData.averageScore}</div>
          <p className="text-xs text-muted-foreground">Across all your attempts</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Best Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentUserData.bestScore}</div>
          <p className="text-xs text-muted-foreground">Your highest score achieved</p>
        </CardContent>
      </Card>
    </div>
  );
}
