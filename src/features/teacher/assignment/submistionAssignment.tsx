import React from 'react';
import { useParams } from 'react-router-dom';
import {
  useGetSubmissionByAssignmentForCoachQuery,
  useGradeSubmissionMutation,
} from '../api.teacher';
import { skipToken } from '@reduxjs/toolkit/query';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import GradeAssignment from './GradeAssignment';
import { toast } from 'sonner';

export function CoachGradingSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-48" />

      <Card>
        <CardContent className="p-4 space-y-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-96" />
        </CardContent>
      </Card>

      <Skeleton className="h-4 w-36" />
      <Skeleton className="h-4 w-80" />

      <div className="border-t pt-4 mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center space-y-2">
            <Skeleton className="h-4 w-32 mx-auto" />
            <Skeleton className="h-6 w-24 mx-auto" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center space-y-2">
            <Skeleton className="h-4 w-32 mx-auto" />
            <Skeleton className="h-4 w-40 mx-auto" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center space-y-2">
            <Skeleton className="h-4 w-40 mx-auto" />
            <Skeleton className="h-10 w-32 mx-auto mt-2" />
          </CardContent>
        </Card>
      </div>

      <Skeleton className="h-10 w-24" />
    </div>
  );
}

const SubmissionAssignmentPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isFetching } = useGetSubmissionByAssignmentForCoachQuery(id ?? skipToken, {
    selectFromResult: ({ data, isFetching }) => ({
      data: data?.data || [],
      isFetching,
    }),
  });

  const [gradeSubmission] = useGradeSubmissionMutation();

  const assignment = data.length > 0 ? data[0].assignment : null;

  const submissions = data.length > 0 ? data : [];

  console.log('submissions', submissions);

  const [grading, setGrading] = React.useState<string | null>(null);
  const [score, setScore] = React.useState<string>('');
  const [feedback, setFeedback] = React.useState<string>('');

  const handleSaveGrade = async () => {
    const toastId = toast.loading('Saving grade...');
    try {
      if (grading) {
        // Logic to save the grade, e.g., API call
        await gradeSubmission({ id: grading, data: { score, feedback } }).unwrap();
        toast.success('Grade saved successfully!', { id: toastId });
        setGrading(null); // Close the grading dialog
      }
    } catch {
      toast.error('Failed to save grade. Please try again.', { id: toastId });
    }
  };

  return isFetching ? (
    <CoachGradingSkeleton />
  ) : (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">{assignment?.title}</h2>

      <Card>
        <CardContent className="p-4 space-y-2">
          <h4 className="font-medium">Assignment Content</h4>
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: assignment?.content }} />
          </div>
          <p className="text-sm">
            DUE DATE: {format(new Date(assignment?.dueTime ?? new Date()), 'yyyy-MM-dd HH:mm:ss')}{' '}
            (GMT+07)
          </p>
        </CardContent>
      </Card>

      <h4 className="text-lg font-semibold mt-6">Submissions</h4>

      <div className="space-y-4">
        {submissions
          ?.sort(
            (a: any, b: any) =>
              new Date(a?.submittedAt).getTime() - new Date(b?.submittedAt).getTime(),
          )
          ?.map((s: any) => (
            <Card key={s.id}>
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={s?.createdByUser?.profileImage}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{s?.createdByUser?.email}</p>
                    <p className="text-sm text-muted-foreground">
                      Submitted at:{' '}
                      {format(new Date(s?.submittedAt ?? new Date()), 'yyyy-MM-dd HH:mm:ss')}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <a href={s.content} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">View File</Button>
                  </a>
                  <Button variant="default" onClick={() => setGrading(s.id)}>
                    Grade
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
      <GradeAssignment
        grading={grading}
        setGrading={setGrading}
        score={score}
        setScore={setScore}
        feedback={feedback}
        setFeedback={setFeedback}
        handleSaveGrade={handleSaveGrade}
      />
    </div>
  );
};

export default SubmissionAssignmentPage;
