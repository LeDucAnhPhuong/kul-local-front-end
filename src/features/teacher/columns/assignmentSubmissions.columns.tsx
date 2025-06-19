import type { ColumnDef } from '@tanstack/react-table';
import type { VideoSubmission, DocumentSubmission } from '../functionaly/content';
export type SubmissionContent = VideoSubmission | DocumentSubmission;
export type AssignmentSubmission = {
  id: string;
  assignmentId: string;
  userId: string;
  submittedAt: string;
  score: number | null;
  feedback: string | null;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  content: SubmissionContent;
};
export const columns: ColumnDef<AssignmentSubmission>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => row.getValue('id'),
  },
  {
    accessorKey: 'assignmentId',
    header: 'Assignment ID',
    cell: ({ row }) => row.getValue('assignmentId'),
  },
  {
    accessorKey: 'userId',
    header: 'User ID',
    cell: ({ row }) => row.getValue('userId'),
  },
  {
    accessorKey: 'submittedAt',
    header: 'Submitted At',
    cell: ({ row }) => new Date(row.getValue('submittedAt')).toLocaleString(),
  },
  {
    accessorKey: 'score',
    header: 'Score',
    cell: ({ row }) => (row.getValue('score') !== null ? row.getValue('score') : '-'),
  },
  {
    accessorKey: 'feedback',
    header: 'Feedback',
    cell: ({ row }) => row.getValue('feedback') || '-',
  },
  // {
  //     accessorKey: 'content',
  //     header: 'Content Type',
  //     cell: ({ row }: { row: Row<AssignmentSubmission> }) => {
  //         const content = row.getValue('content');
  //         return content.type === 'video' ? 'Video Submission' : 'Document Submission';
  //     },
  // }
];
