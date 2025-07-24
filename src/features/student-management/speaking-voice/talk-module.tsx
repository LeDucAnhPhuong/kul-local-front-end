'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Mic } from 'lucide-react';
import { SpeakingOverlay } from './speaking-overlay';
import { type UserScoreData } from './user-score-card';
import { LeaderboardTable } from './leaderboard-table';
import { TopThreeCards } from './top-three-card';
import { CurrentUserSummaryCard } from './user-summary';
import { useGetSpeakingLeaderboardQuery } from './api.speaking';
import { DashboardSkeleton } from './dashboard-skeleton';

export const mockLeaderboardData: UserScoreData[] = [
  {
    userId: {
      profileImage: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png',
      email: 'phuonglda.test@gmail.com',
      firstName: 'Phuong',
      lastName: 'Le',
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
    latestScore: 88, // Example latest score
  },
  {
    userId: {
      profileImage: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png', // Placeholder for sylus
      email: 'sylus@example.com',
      firstName: 'Sylus',
      lastName: null,
      classId: 'class1',
      role: 'Student',
      id: 'user1',
      createdAt: '2025-06-20T06:00:00.000Z',
      updatedAt: '2025-06-20T06:00:00.000Z',
      isActive: true,
      createdBy: null,
      updatedBy: null,
      createdByUser: null,
      updatedByUser: null,
    },
    totalAttempts: 2,
    averageScore: 74,
    bestScore: 74,
    latestScore: 74,
  },
  {
    userId: {
      profileImage: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png', // Placeholder for AnMaiTech
      email: 'anmaitech@example.com',
      firstName: 'AnMai',
      lastName: 'Tech',
      classId: 'class1',
      role: 'Student',
      id: 'user2',
      createdAt: '2025-06-21T06:00:00.000Z',
      updatedAt: '2025-06-21T06:00:00.000Z',
      isActive: true,
      createdBy: null,
      updatedBy: null,
      createdByUser: null,
      updatedByUser: null,
    },
    totalAttempts: 1,
    averageScore: 74,
    bestScore: 74,
    latestScore: 74,
  },
  {
    userId: {
      profileImage: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png', // Placeholder for maithaomy
      email: 'maithaomy@example.com',
      firstName: 'Mai',
      lastName: 'Thao My',
      classId: 'class1',
      role: 'Student',
      id: 'user3',
      createdAt: '2025-06-22T06:00:00.000Z',
      updatedAt: '2025-06-22T06:00:00.000Z',
      isActive: true,
      createdBy: null,
      updatedBy: null,
      createdByUser: null,
      updatedByUser: null,
    },
    totalAttempts: 1,
    averageScore: 72,
    bestScore: 72,
    latestScore: 72,
  },
  {
    userId: {
      profileImage: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png', // Placeholder for nguyenhoangkimngan
      email: 'nguyenhoangkimngan@example.com',
      firstName: 'Nguyen',
      lastName: 'Hoang Kim Ngan',
      classId: 'class1',
      role: 'Student',
      id: 'user4',
      createdAt: '2025-06-23T06:00:00.000Z',
      updatedAt: '2025-06-23T06:00:00.000Z',
      isActive: true,
      createdBy: null,
      updatedBy: null,
      createdByUser: null,
      updatedByUser: null,
    },
    totalAttempts: 1,
    averageScore: 70,
    bestScore: 70,
    latestScore: 70,
  },
  {
    userId: {
      profileImage: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png', // Placeholder for thule
      email: 'thule@example.com',
      firstName: 'Thu',
      lastName: 'Le',
      classId: 'class1',
      role: 'Student',
      id: 'user5',
      createdAt: '2025-06-24T06:00:00.000Z',
      updatedAt: '2025-06-24T06:00:00.000Z',
      isActive: true,
      createdBy: null,
      updatedBy: null,
      createdByUser: null,
      updatedByUser: null,
    },
    totalAttempts: 2,
    averageScore: 69,
    bestScore: 69,
    latestScore: 69,
  },
  {
    userId: {
      profileImage: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png', // Placeholder for duonglevu
      email: 'duonglevu@example.com',
      firstName: 'Duong',
      lastName: 'Le Vu',
      classId: 'class1',
      role: 'Student',
      id: 'user6',
      createdAt: '2025-06-25T06:00:00.000Z',
      updatedAt: '2025-06-25T06:00:00.000Z',
      isActive: true,
      createdBy: null,
      updatedBy: null,
      createdByUser: null,
      updatedByUser: null,
    },
    totalAttempts: 2,
    averageScore: 68,
    bestScore: 68,
    latestScore: 68,
  },
];

const getDateRange = (timeFilter: string) => {
  const now = new Date();
  switch (timeFilter) {
    case 'day':
      return {
        startDate: new Date(now.setHours(0, 0, 0, 0)),
        endDate: new Date(now.setHours(23, 59, 59, 999)),
      };
    case 'week':
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      return { startDate: startOfWeek, endDate: endOfWeek };
    case 'month':
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return { startDate: startOfMonth, endDate: endOfMonth };
    case 'year':
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const endOfYear = new Date(now.getFullYear(), 11, 31);
      return { startDate: startOfYear, endDate: endOfYear };
    default:
      return { startDate: now, endDate: now };
  }
};

export function TalkModule() {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [period, setPeriod] = useState('week'); // State for time filter

  const dateRange = useMemo(() => getDateRange(period), [period]);

  const { data, isLoading } = useGetSpeakingLeaderboardQuery(
    {
      startDate: dateRange.startDate.toISOString(),
      endDate: dateRange.endDate.toISOString(),
    },
    {
      selectFromResult: ({ data, isFetching }) => ({
        data: data?.data || [],
        isLoading: isFetching,
      }),
    },
  );

  // Sort data by bestScore in descending order to determine ranks

  const topThreeUsers = data.slice(0, 3);
  const currentUserData = data.find((user: UserScoreData) => user?.me);
  const currentUserRank = currentUserData ? data.indexOf(currentUserData) + 1 : undefined;

  return (
    <div className="flex flex-col items-center min-h-screen bg-white rounded-lg p-4">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">My Talk - Speaking Practice</h1>
        <p className="text-lg text-gray-600 mb-12 text-center max-w-md">
          Click the microphone to start your English speaking challenge!
        </p>
        <Button
          onClick={() => setIsOverlayOpen(true)}
          className="w-24 h-24 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105"
          aria-label="Start speaking practice"
        >
          <Mic className="w-12 h-12" />
        </Button>

        <Dialog open={isOverlayOpen} onOpenChange={setIsOverlayOpen}>
          <DialogContent className="w-full h-full max-w-none p-0 bg-white flex items-center justify-center">
            <SpeakingOverlay onClose={() => setIsOverlayOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex w-full min-h-screen flex-col p-4 md:p-8">
        <div className="flex justify-end mb-10">
          <div className="flex mt-4 bg-gray-200 p-2 rounded-lg justify-end space-x-2">
            <Button
              variant={period === 'week' ? 'default' : 'outline'}
              onClick={() => setPeriod('week')}
            >
              Week
            </Button>
            <Button
              variant={period === 'month' ? 'default' : 'outline'}
              onClick={() => setPeriod('month')}
            >
              Month
            </Button>
            <Button
              variant={period === 'year' ? 'default' : 'outline'}
              onClick={() => setPeriod('year')}
            >
              Year
            </Button>
          </div>
        </div>
        <div className="flex-1 items-start gap-4">
          {isLoading ? (
            <DashboardSkeleton />
          ) : (
            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
              <TopThreeCards topUsers={topThreeUsers} />
              <CurrentUserSummaryCard
                currentUserData={currentUserData}
                currentUserRank={currentUserRank}
                totalPlayers={data ? data.length : 0}
                onGoToSpeakingPractice={() => setIsOverlayOpen(true)}
              />
              <LeaderboardTable data={data} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
