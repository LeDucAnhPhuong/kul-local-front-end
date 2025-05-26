import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import React from 'react';

interface ListQuizzesProps {
  onBack: () => void;
}

const ListQuizzes = ({ onBack }: ListQuizzesProps) => {
  const quizzesData = [
    { id: 1, title: 'Grammar Basics', score: 85, status: 'completed', date: '2024-05-20' },
    { id: 2, title: 'Vocabulary Test', score: 92, status: 'completed', date: '2024-05-18' },
    { id: 3, title: 'Reading Comprehension', score: 78, status: 'completed', date: '2024-05-15' },
    { id: 4, title: 'Listening Practice', score: null, status: 'pending', date: '2024-05-25' },
    { id: 5, title: 'Speaking Assessment', score: null, status: 'upcoming', date: '2024-05-28' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      completed: 'bg-green-500 hover:bg-green-600',
      pending: 'bg-yellow-500 hover:bg-yellow-600',
      upcoming: 'bg-blue-500 hover:bg-blue-600',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold">Quiz Results</h1>
      </div>
      
      <div className="grid gap-4">
        {quizzesData.map((quiz) => (
          <Card key={quiz.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <FileText className="w-8 h-8 text-blue-500" />
                <div>
                  <h3 className="font-medium">{quiz.title}</h3>
                  <p className="text-sm text-muted-foreground">{quiz.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {quiz.score && (
                  <div className="text-right">
                    <div className="text-lg font-bold">{quiz.score}/100</div>
                  </div>
                )}
                <Badge className={getStatusBadge(quiz.status)}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(quiz.status)}
                    {quiz.status}
                  </div>
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};
export default ListQuizzes;