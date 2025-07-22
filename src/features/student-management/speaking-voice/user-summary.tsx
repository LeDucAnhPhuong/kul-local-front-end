'use client';

import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { UserScoreData } from './user-score-card';

interface CurrentUserSummaryCardProps {
  currentUserData: UserScoreData | undefined;
  currentUserRank: number | undefined;
  totalPlayers: number;
  onGoToSpeakingPractice: () => void;
}

export function CurrentUserSummaryCard({
  currentUserData,
  currentUserRank,
  totalPlayers,
  onGoToSpeakingPractice,
}: CurrentUserSummaryCardProps) {
  // Condition for "2 lần nữa để xếp hạng"
  const needsMoreAttempts = currentUserData && currentUserData.totalAttempts < 3;

  // Function to get display name from firstName and lastName, or fallback to email
  const getDisplayName = (user: UserScoreData['userId']) => {
    if (user?.firstName && user?.lastName) {
      return `${user?.firstName} ${user?.lastName}`;
    }
    if (user?.firstName) {
      return user?.firstName;
    }
    return user?.email.split('@')[0]; // Use part of email as fallback
  };

  return (
    <Card className="flex flex-row items-end justify-between p-4 rounded-lg shadow-md bg-white">
      <div className="flex items-center gap-4">
        <Avatar className="w-16 h-16 bg-teal-500 text-white">
          <AvatarImage
            src={currentUserData?.userId.profileImage || '/placeholder.svg'}
            alt={getDisplayName(currentUserData?.userId!)} // Use getDisplayName for alt text
          />
          <AvatarFallback className="bg-teal-500 text-white text-2xl">
            {currentUserData?.userId.firstName?.charAt(0).toUpperCase() || 'P'}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold">
              {currentUserData ? getDisplayName(currentUserData.userId) : 'Guest User'}
            </h3>
            {needsMoreAttempts && (
              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                2 lần nữa để xếp hạng
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">
            {currentUserRank !== undefined
              ? `${currentUserRank} / ${totalPlayers}`
              : 'Chưa xếp hạng'}
          </p>
          {/* Removed detailed scores (best, average, latest) to match the new image */}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-center shadow-sm p-2 rounded-lg">
          <div className="text-2xl font-bold text-gray-800">{currentUserData?.bestScore || 0}</div>
          <div className="text-sm text-gray-500">Score (1)</div>
        </div>
        <div className="text-center shadow-sm p-2 rounded-lg">
          <div className="text-2xl font-bold text-gray-800">
            {currentUserData?.averageScore || 0}
          </div>
          <div className="text-sm text-gray-500">Score (1)</div>
        </div>
        <div className="text-center shadow-sm p-2 rounded-lg">
          <div className="text-2xl font-bold text-gray-800">
            {currentUserData?.latestScore || 0}
          </div>
          <div className="text-sm text-gray-500">Score (1)</div>
        </div>
        <Button
          onClick={onGoToSpeakingPractice}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-base"
        >
          Start Challenge
        </Button>
      </div>
    </Card>
  );
}
