import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Trophy, Medal, Award } from 'lucide-react';
import React from 'react';

interface LeaderBoardViewProps {
  onBack: () => void;
}

const LeaderBoardView = ({ onBack }: LeaderBoardViewProps) => {
  const leaderboardData = [
    { rank: 1, name: 'Alice Johnson', score: 95, icon: Trophy, color: 'text-yellow-500' },
    { rank: 2, name: 'Bob Smith', score: 92, icon: Medal, color: 'text-gray-400' },
    { rank: 3, name: 'Carol Davis', score: 88, icon: Award, color: 'text-amber-600' },
    { rank: 4, name: 'David Wilson', score: 85, icon: Award, color: 'text-blue-500' },
    { rank: 5, name: 'Eva Brown', score: 82, icon: Award, color: 'text-green-500' },
  ];

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold">Leaderboard</h1>
      </div>
      
      <div className="space-y-4">
        {leaderboardData.map((student) => {
          const IconComponent = student.icon;
          return (
            <Card key={student.rank}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <IconComponent className={`h-5 w-5 ${student.color}`} />
                    <span className="text-lg font-bold">#{student.rank}</span>
                  </div>
                  <div>
                    <h3 className="font-medium">{student.name}</h3>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{student.score}</div>
                  <div className="text-sm text-muted-foreground">points</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
};
export default LeaderBoardView;
