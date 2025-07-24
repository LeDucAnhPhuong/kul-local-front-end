import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Hash } from 'lucide-react';
import type { UserScoreData } from './user-score-card';

interface LeaderboardTableProps {
  data: UserScoreData[];
}

export function LeaderboardTable({ data }: LeaderboardTableProps) {
  // Sort data by bestScore in descending order
  const sortedData = [...data].sort((a, b) => b.bestScore - a.bestScore);

  // Filter out the top 3 as they are displayed separately
  const remainingData = sortedData.slice(3);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2 text-blue-600">
          <Hash className="w-5 h-5" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Rank</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="text-right">Best score</TableHead>
              <TableHead className="text-right">Average score</TableHead>
              <TableHead className="text-right">Attempts</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {remainingData.map((user, index) => (
              <TableRow key={user?.userId?.id} className={user?.me ? 'bg-blue-50' : ''}>
                <TableCell className="font-medium">{index + 4}</TableCell>{' '}
                {/* Ranks start from 4 */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={user?.userId?.profileImage || '/placeholder.svg'}
                        alt={user?.userId?.firstName + ' ' + user?.userId?.lastName || 'User'}
                      />
                      <AvatarFallback className="bg-gray-200 text-gray-700">
                        {(user?.userId?.firstName + ' ' + user?.userId?.lastName || 'User')
                          .charAt(0)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{user?.userId?.firstName + ' ' + user?.userId?.lastName || 'User'}</span>
                    <span className="text-gray-500">
                      <span className="text-yellow-400">&#129418;</span> {user?.bestScore % 10}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">{user?.averageScore}</TableCell>
                <TableCell className="text-right">{user?.totalAttempts}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
