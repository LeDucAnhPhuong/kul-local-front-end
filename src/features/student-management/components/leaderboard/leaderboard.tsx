'use client';

import { useState, useEffect }  from 'react';
import { Trophy }  from 'lucide-react';
import { Button }  from '@/components/ui/button';
import { Calendar, Clock, TrendingUp }  from 'lucide-react';
import { format }  from 'date-fns';
import type { LeaderboardEntry, TimePeriod }  from './leaderboard.type';
import PodiumCard  from './podium-card';
import RegularRankCard  from './regular-rank-card';
import { getDateRange }  from './leaderboard.utils';
import { useGetLeaderBoardQuery }  from './leaderboard.api';
import { skipToken }  from '@reduxjs/toolkit/query';
import { zoneTimeToUTC }  from '@/utils/zone-time-to-utc';

// Simulated API call with date filtering
export default  function Leaderboard() {
const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('week');
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const [periodInfo, setPeriodInfo] = useState<{
  startDate: Date;
  endDate: Date;
  label: string;
} | null>(null);

const { leaderboardData, loading } = useGetLeaderBoardQuery(
  periodInfo?.startDate && periodInfo?.endDate
    ? {
        startDate: zoneTimeToUTC(periodInfo?.startDate, timeZone).toISOString(),
        endDate: zoneTimeToUTC(periodInfo?.endDate, timeZone).toISOString(),
      }
    : skipToken,
  {
    selectFromResult: ({ data, isLoading }) => ({
      leaderboardData: data?.data || [],
      loading: isLoading,
    }),
  },
);

useEffect(() => {
  const { startDate, endDate, label } = getDateRange(selectedPeriod);
  setPeriodInfo({ startDate, endDate, label });
}, [selectedPeriod]);

const TimeFilterButtons = () => {
  const periods = [
    { key: 'week' as TimePeriod, label: 'This Week', icon: Clock },
    { key: 'month' as TimePeriod, label: 'This Month', icon: Calendar },
    { key: 'year' as TimePeriod, label: 'This Year', icon: TrendingUp },
  ];

  return (
    <div className="flex justify-center mb-8">
      <div className="p-1 bg-white border rounded-lg shadow-lg">
        <div className="flex space-x-1">
          {periods.map((period) => {
            const Icon = period.icon;
            const isActive = selectedPeriod === period.key;
            return (
              <Button
                key={period.key}
                variant={isActive ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedPeriod(period.key)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {period.label}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const topThree = leaderboardData.slice(0, 3);
const restOfRanks = leaderboardData.slice(3);

return (
  <div className="w-full min-h-screen p-6 bg-white rounded-lg">
    {/* Header */}
    <div className="mb-12 text-center">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Trophy className="w-10 h-10 text-yellow-500" />
        <h1 className="text-4xl font-extrabold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text">
          Leaderboard
        </h1>
        <Trophy className="w-10 h-10 text-yellow-500" />
      </div>
      <p className="text-lg text-gray-600">
        Honoring the most outstanding individuals - {periodInfo?.label}
      </p>
      {periodInfo && (
        <p className="mt-2 text-sm text-gray-500">
          From {format(new Date(periodInfo.startDate), 'dd/MM/yyyy')} to{' '}
          {format(new Date(periodInfo.endDate), 'dd/MM/yyyy')}
        </p>
      )}
    </div>

    <TimeFilterButtons />
    {loading ? (
      <div className="p-6 mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <div className="w-64 h-8 mx-auto mb-4 bg-gray-200 rounded animate-pulse" />
          <div className="w-48 h-4 mx-auto bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Filter buttons loading */}
        <div className="flex justify-center mb-8">
          <div className="h-12 bg-gray-200 rounded-lg w-80 animate-pulse" />
        </div>

        {/* Top 3 Loading */}
        <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse" />
          ))}
        </div>

        {/* Rest Loading */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    ) : (
      <div>
        {topThree.length > 0 && (
          <div className="mb-16">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-2xl font-bold text-gray-800">🏆 PODIUM OF HONOR 🏆</h2>
              <div className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
            </div>

            <div className="grid max-w-5xl grid-cols-1 gap-6 mx-auto md:grid-cols-3">
              {/* Arrange in podium order: 2nd, 1st, 3rd */}
              {topThree.length >= 2 && (
                <div className="md:order-1 md:mt-8">
                  <PodiumCard entry={topThree[1]} rank={2} />
                </div>
              )}
              {topThree.length >= 1 && (
                <div className="md:order-2">
                  <PodiumCard entry={topThree[0]} rank={1} />
                </div>
              )}
              {topThree.length >= 3 && (
                <div className="md:order-3 md:mt-16">
                  <PodiumCard entry={topThree[2]} rank={3} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rest of Rankings */}
        {restOfRanks.length > 0 && (
          <div>
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-2xl font-bold text-gray-800">📊 Overall Leaderboard</h2>
              <div className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              {restOfRanks.map((entry: LeaderboardEntry, index: number) => (
                <RegularRankCard key={entry.user.email} entry={entry} rank={index + 4} />
              ))}
            </div>
          </div>
        )}

        {leaderboardData.length === 0 && (
          <div className="py-16 text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg text-gray-500">not found</p>
          </div>
        )}
      </div>
    )}
  </div>
);
}
