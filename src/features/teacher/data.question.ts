import { Question } from './functionaly/question';

export const questions: Question[] = [
  new Question({
    _id: 'q001',
    quiz_id: 'c001',
    content: 'What is React primarily used for?',
    options: ['Styling web pages', 'Managing databases', 'Building user interfaces', 'Handling server-side logic'],
    correct_answer: 'Building user interfaces',
    score: 1,
    isActive: true,
    created_by: 'admin',
    updated_by: 'admin',
    created_at: '2025-05-10T09:00:00Z',
    updated_at: '2025-05-11T08:30:00Z',
    time_limit: 30, // Thời gian làm bài cho câu hỏi này là 30 giây
  }),
  new Question({
    _id: 'q002',
    quiz_id: 'c001',
    content: 'Which hook is used for side effects in React?',
    options: ['useState', 'useEffect', 'useContext', 'useReducer'],
    correct_answer: 'useEffect',
    score: 1,
    isActive: true,
    created_by: 'admin',
    updated_by: 'admin',
    created_at:'2025-05-10T09:30:00Z',
    updated_at: '2025-05-10T10:00:00Z',
    time_limit: 30, // Thời gian làm bài cho câu hỏi này là 30 giây
  }),
  // Thêm các câu hỏi khác tương tự
];
