import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useRef } from 'react';

type AssignmentData = {
  title: string;
  dueTime: string;
  content: string; // HTML hoặc URL
};

type SubmissionData = {
  content: string;
  submittedAt: string;
  score?: number;
  feedback?: string;
};

type Props = {
  assignment: AssignmentData;
  submissions?: SubmissionData | null;
  onResubmit?: (file: File) => void;
  onFirstSubmit?: (file: File) => void;
  loading?: boolean;
};

export function AssignmentSubmissionCard({
  assignment,
  submissions,
  onResubmit,
  onFirstSubmit,
  loading,
}: Props) {
  const isSubmitted = !!submissions;

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isSubmitted) {
      onResubmit?.(file);
    } else {
      onFirstSubmit?.(file);
    }

    e.target.value = '';
  };

  return loading ? (
    <AssignmentSubmissionSkeleton />
  ) : (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">{assignment?.title}</h2>

      <Card>
        <CardContent>
          <CardHeader className="p-0">
            <h3 className="text-lg font-medium">Assignment Details</h3>
          </CardHeader>
          <div className="prose max-w-none">
            {assignment?.content?.startsWith('http') ? (
              <a
                href={assignment?.content}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {assignment?.content?.split('/').pop()}
              </a>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: assignment?.content }} />
            )}
          </div>
        </CardContent>
      </Card>

      <div className="text-sm font-semibold uppercase mt-4">Additional Files</div>
      <div className="text-sm">
        DUE DATE:{' '}
        {format(
          assignment?.dueTime ? new Date(assignment?.dueTime) : new Date(),
          'yyyy-MM-dd HH:mm:ss',
        )}{' '}
        (GMT+07){' '}
        {submissions?.score !== undefined && (
          <span className="text-red-600 font-semibold">
            - SCORE (Your score): {submissions?.score ?? 'N/A'}
          </span>
        )}
        {submissions?.feedback && (
          <div className="mt-2">
            <span className="text-gray-600">Feedback: </span>
            <span className="text-gray-800">{submissions?.feedback}</span>
          </div>
        )}
      </div>

      <div className="border-t pt-4 mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 space-y-1 text-center">
            <div className="text-xs font-semibold text-muted-foreground">SUBMISSION STATUS</div>
            <Badge variant={isSubmitted ? 'default' : 'secondary'}>
              {isSubmitted ? 'Submitted' : 'Not Submitted'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-1 text-center">
            <div className="text-xs font-semibold text-muted-foreground">SUBMISSION TIME</div>
            <div className="text-sm">
              {isSubmitted
                ? format(new Date(submissions?.submittedAt), 'yyyy-MM-dd HH:mm:ss') + ' (GMT+07)'
                : 'N/A'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-1 text-center">
            <div className="text-xs font-semibold text-muted-foreground">LINK/FILE ASSIGNMENT</div>
            {isSubmitted ? (
              <a
                href={submissions?.content}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-2"
              >
                <Button>GET MY FILE</Button>
              </a>
            ) : (
              <Button
                variant="default"
                className="mt-2"
                onClick={() => fileInputRef.current?.click()}
              >
                ADD FILE
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
      <input
        type="file"
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {isSubmitted && (
        <div className="mt-4">
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            RE-SUBMIT
          </Button>
        </div>
      )}
    </div>
  );
}

export function AssignmentSubmissionSkeleton() {
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
