import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Video, Play, Eye } from 'lucide-react';

interface ListVideoSubmittedProps {
  onBack: () => void;
}

const ListVideoSubmitted = ({ onBack }: ListVideoSubmittedProps) => {
  const videosData = [
    {
      id: 1,
      title: 'Speaking Practice - Part 1',
      duration: '3:45',
      status: 'graded',
      score: 8.5,
      date: '2024-05-22',
      feedback: 'Good pronunciation, work on fluency'
    },
    {
      id: 2,
      title: 'Presentation - Environmental Issues',
      duration: '5:20',
      status: 'under_review',
      score: null,
      date: '2024-05-20',
      feedback: null
    },
    {
      id: 3,
      title: 'Reading Aloud Exercise',
      duration: '2:30',
      status: 'submitted',
      score: null,
      date: '2024-05-18',
      feedback: null
    },
  ];

  const getStatusBadge = (status: string) => {
    const config = {
      graded: { color: 'bg-green-500 hover:bg-green-600', text: 'Graded' },
      under_review: { color: 'bg-yellow-500 hover:bg-yellow-600', text: 'Under Review' },
      submitted: { color: 'bg-blue-500 hover:bg-blue-600', text: 'Submitted' },
    };
    return config[status as keyof typeof config] || config.submitted;
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold">Video Submissions</h1>
      </div>
      
      <div className="grid gap-4">
        {videosData.map((video) => {
          const statusConfig = getStatusBadge(video.status);
          return (
            <Card key={video.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start flex-1 gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg dark:bg-blue-900">
                      <Video className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{video.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>Duration: {video.duration}</span>
                        <span>Submitted: {video.date}</span>
                      </div>
                      {video.feedback && (
                        <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                          Feedback: {video.feedback}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {video.score && (
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          {video.score}/10
                        </div>
                        <div className="text-xs text-muted-foreground">Score</div>
                      </div>
                    )}
                    <Badge className={statusConfig.color}>
                      {statusConfig.text}
                    </Badge>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm">
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
};
export default ListVideoSubmitted;