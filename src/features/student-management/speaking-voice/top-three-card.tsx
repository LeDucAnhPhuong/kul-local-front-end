import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle } from 'lucide-react';
import type { UserScoreData } from './user-score-card';

interface TopThreeCardsProps {
  topUsers: UserScoreData[];
}

export function TopThreeCards({ topUsers }: TopThreeCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {topUsers.map((user, index) => (
        <Card
          key={user.userId.id}
          className="relative flex flex-col items-center justify-center bg-gray-700 text-white p-6 rounded-lg shadow-lg"
        >
          <div className="absolute top-4 left-4 text-2xl font-bold text-gray-300">#{index + 1}</div>
          <Avatar className="w-24 h-24 mb-4 border-4 border-white">
            <AvatarImage
              src={user.userId.profileImage || '/placeholder.svg'}
              alt={user.userId.firstName + ' ' + user.userId.lastName}
            />
            <AvatarFallback className="bg-blue-500 text-white text-3xl">
              {`${user.userId.firstName + ' ' + user.userId.lastName}`.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-semibold">
              {user.userId.firstName + ' ' + user.userId.lastName}
            </h3>
            <span className="text-gray-300">
              <span className="text-yellow-400">&#129418;</span> {user.bestScore % 10}
            </span>{' '}
            {/* Example for the small number next to emoji */}
          </div>
          <div className="text-5xl font-bold mb-1">{user.bestScore}</div>
          <div className="text-sm text-gray-300">{user.totalAttempts} Attempt</div>
        </Card>
      ))}
    </div>
  );
}
