// mockSubmissions.ts
import type {AssignmentSubmission}  from './columns/assignmentSubmissions.columns';

export const mockSubmissions: AssignmentSubmission[] = [
  {
    id: 'sub_001',
    assignmentId: 'ass_001',
    userId: 'user_123',
    submittedAt: '2025-06-01T10:00:00Z',
    score: 9.0,
    feedback: 'Làm rất tốt, cần nói chậm hơn một chút.',
    isActive: true,
    createdBy: 'user_123',
    updatedBy: 'coach_001',
    createdAt: '2025-06-01T10:01:00Z',
    updatedAt: '2025-06-01T12:00:00Z',
    content: {
      type: 'video',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4', // video demo
    },
  },
  {
    id: 'sub_002',
    assignmentId: 'ass_002',
    userId: 'user_456',
    submittedAt: '2025-06-02T15:30:00Z',
    score: null,
    feedback: null,
    isActive: true,
    createdBy: 'user_456',
    updatedBy: 'coach_001',
    createdAt: '2025-06-02T15:31:00Z',
    updatedAt: '2025-06-02T15:31:00Z',
    content: {
      type: 'document',
      url: 'https://example.com/sample.pdf', // thay bằng link thật nếu có
    },
  },
  {
    id: 'sub_003',
    assignmentId: 'ass_001',
    userId: 'user_789',
    submittedAt: '2025-06-03T08:15:00Z',
    score: 7.5,
    feedback: 'Nội dung ổn nhưng thiếu phần kết luận.',
    isActive: true,
    createdBy: 'user_789',
    updatedBy: 'coach_002',
    createdAt: '2025-06-03T08:16:00Z',
    updatedAt: '2025-06-03T09:00:00Z',
    content: {
      type: 'video',
      url: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4', // video 5s
    },
  },
];
