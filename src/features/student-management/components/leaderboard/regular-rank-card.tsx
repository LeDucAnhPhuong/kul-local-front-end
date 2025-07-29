import { Avatar, AvatarFallback, AvatarImage }  from "@/components/ui/avatar";
import { Card, CardContent }  from "@/components/ui/card";
import type { LeaderboardEntry }  from "./leaderboard.type";
import { getDisplayName, getInitials }  from "./leaderboard.utils";


const RegularRankCard = ({ entry, rank }: { entry: LeaderboardEntry; rank: number }) => {
return (
  <Card className="transition-all duration-300 border-l-4 hover:shadow-lg border-l-blue-500">
    <CardContent className="flex items-center p-4 space-x-4">
      {/* Rank */}
      <div className="flex items-center justify-center w-12 h-12 text-lg font-bold text-white rounded-full shadow-md bg-gradient-to-br from-blue-500 to-blue-600">
        {rank}
      </div>

      {/* Avatar */}
      <Avatar className="h-14 w-14 ring-2 ring-blue-100">
        <AvatarImage
          src={entry.user.profileImage || '/placeholder.svg'}
          alt={getDisplayName(entry.user)}
        />
        <AvatarFallback className="text-sm font-semibold">
          {getInitials(entry.user)}
        </AvatarFallback>
      </Avatar>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-900 truncate">
          {getDisplayName(entry.user)}
        </h3>
        <p className="text-sm text-gray-500 truncate">{entry.user.email}</p>
        <div className="flex items-center gap-4 mt-1">
          <span className="text-xs text-gray-400">Điểm TB: {entry.averageScore.toFixed(1)}</span>
          <span className="text-xs text-gray-400">Lần thử: {entry.attempts}</span>
        </div>
      </div>

      {/* Score */}
      <div className="text-right">
        <div className="text-2xl font-bold text-blue-600">{entry.highestScore}</div>
        <div className="text-xs text-gray-500">điểm cao nhất</div>
      </div>
    </CardContent>
  </Card>
);
};

export default RegularRankCard;