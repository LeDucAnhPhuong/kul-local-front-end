import type { VideoSubmission, DocumentSubmission } from '../functionaly/content';

export type SubmissionContent = VideoSubmission | DocumentSubmission;
export type AssignmentSubmission = {
  id: string;
  assignment: Assignment;
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

export type Assignment = {
  id: string;
  title: string;
  type: SubmissionContent;
  startTime: string;
  dueTime: string;
  content: string; // URL to the assignment file
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
};

export const AssignmentEnum = {
  Check1: 'Check1',
  Check2: 'Check2',
  Essay: 'Essay',
} as const;

export type AssignmentType = keyof typeof AssignmentEnum;
