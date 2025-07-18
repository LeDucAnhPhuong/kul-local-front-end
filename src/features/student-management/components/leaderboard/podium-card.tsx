import { Card, CardContent } from '@/components/ui/card';
import { Crown, Medal, Award, Star, Sparkles, Badge } from 'lucide-react';
import type { LeaderboardEntry } from './leaderboard.type';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getDisplayName, getInitials } from './leaderboard.utils';

const PodiumCard = ({ entry, rank }: { entry: LeaderboardEntry; rank: number }) => {
  const getPodiumStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          gradient: 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600',
          border: 'border-yellow-300',
          shadow: 'shadow-yellow-200/50',
          icon: <Crown className="h-8 w-8 text-yellow-100" />,
          title: '🏆 QUÁN QUÂN',
          height: 'h-80',
          avatarSize: 'h-24 w-24',
          textColor: 'text-yellow-50',
        };
      case 2:
        return {
          gradient: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500',
          border: 'border-gray-300',
          shadow: 'shadow-gray-200/50',
          icon: <Medal className="h-7 w-7 text-gray-100" />,
          title: '🥈 Á QUÂN',
          height: 'h-72',
          avatarSize: 'h-20 w-20',
          textColor: 'text-gray-50',
        };
      case 3:
        return {
          gradient: 'bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700',
          border: 'border-amber-300',
          shadow: 'shadow-amber-200/50',
          icon: <Award className="h-6 w-6 text-amber-100" />,
          title: '🥉 HẠN BA',
          height: 'h-64',
          avatarSize: 'h-18 w-18',
          textColor: 'text-amber-50',
        };
      default:
        return {
          gradient: 'bg-gradient-to-br from-blue-500 to-blue-600',
          border: 'border-blue-300',
          shadow: 'shadow-blue-200/50',
          icon: <Star className="h-5 w-5 text-blue-100" />,
          title: `#${rank}`,
          height: 'h-56',
          avatarSize: 'h-16 w-16',
          textColor: 'text-blue-50',
        };
    }
  };

  const style = getPodiumStyle(rank);

  return (
    <Card
      className={`${style.gradient} ${style.border} ${style.shadow} shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden`}
    >
      {/* Sparkle effects for winner */}
      {rank === 1 && (
        <>
          <Sparkles className="absolute top-2 right-2 h-6 w-6 text-yellow-200 animate-pulse" />
          <Sparkles className="absolute top-4 left-4 h-4 w-4 text-yellow-300 animate-pulse delay-300" />
          <Sparkles className="absolute bottom-4 right-4 h-5 w-5 text-yellow-200 animate-pulse delay-700" />
        </>
      )}

      <CardContent
        className={`${style.height} flex flex-col items-center justify-center p-6 text-center relative z-10`}
      >
        {/* Rank Icon */}
        <div className="mb-4">{style.icon}</div>

        {/* Avatar */}
        <Avatar className={`${style.avatarSize} mb-4 ring-4 ring-white/30 shadow-xl`}>
          <AvatarImage
            src={entry.user.profileImage || '/placeholder.svg'}
            alt={getDisplayName(entry.user)}
          />
          <AvatarFallback className="text-lg font-bold">{getInitials(entry.user)}</AvatarFallback>
        </Avatar>

        <Badge
          className={`mb-3 px-3 py-1 text-xs font-bold ${style.textColor} bg-white/20 hover:bg-white/30`}
        >
          {style.title}
        </Badge>

        <h3 className={`font-bold text-lg mb-2 ${style.textColor} drop-shadow-sm`}>
          {getDisplayName(entry.user)}
        </h3>
        <div className="text-3xl font-bold text-gray-200 mb-2">{entry.averageScore.toFixed(1)}</div>
        <div className={`text-xs ${style.textColor} opacity-80 space-y-1`}>
          <div>Highest Score: {entry.highestScore}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PodiumCard;
