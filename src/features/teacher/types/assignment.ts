import type { VideoSubmission, DocumentSubmission } from '../functionaly/content';

export type SubmissionContent = VideoSubmission | DocumentSubmission;
export type AssignmentSubmission = {
  id: string;
  assignment: {
    id: string;
    type: SubmissionContent;
    title: string;
    deadline: string;
    isActive: boolean;
    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
  };
  userId: string;
  submittedAt: string;
  score: number | null;
  feedback: string | null;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
};
