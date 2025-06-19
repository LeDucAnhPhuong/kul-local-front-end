export interface QuizData {
  _id: number;
  title: string;
  date: string;
  isActive: boolean;
  status: 'Done' | 'Not started' | 'Can not be started'; // Optional status field
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  questions: QuestionData[];
}

export interface QuestionData {
  _id: number;
  quiz_id: number;
  content: string;
  isActive: boolean;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  options: string[];
  timeLimit: number; // Optional time limit for answering the question 10s 20s 30s 
  points: number;
}

export const quizSampleData: QuizData[] = [
  {
    _id: 1,
    title: 'Academic Text Comprehension',
    date: '2025-06-10',
    isActive: true,
    status: 'Can not be started',
    created_by: 1,
    updated_by: 1,
    created_at: '2025-05-20T08:00:00Z',
    updated_at: '2025-05-25T10:30:00Z',
    questions: [
      {
        _id: 1,
        quiz_id: 1,
        content: 'Which of the following is NOT a typical feature of academic texts?',
        isActive: true,
        created_by: 1,
        updated_by: 1,
        created_at: '2025-05-20T08:15:00Z',
        updated_at: '2025-05-20T08:15:00Z',
        options: [
          'Formal vocabulary and complex sentence structures',
          'Objective tone and evidence-based arguments',
          'Emotional language and personal opinions',
          'Citations and references to other sources'
        ],
        timeLimit: 30,
        points: 10
      },
      {
        _id: 2,
        quiz_id: 1,
        content: 'Complete the sentence: "The research _____ that climate change is accelerating faster than previously predicted."',
        isActive: true,
        created_by: 1,
        updated_by: 1,
        created_at: '2025-05-20T08:20:00Z',
        updated_at: '2025-05-20T08:20:00Z',
        options: ['suggests', 'proves', 'denies', 'ignores'],
        timeLimit: 20,
        points: 15
      },
      {
        _id: 3,
        quiz_id: 1,
        content: 'Skimming and scanning are both effective reading strategies for IELTS Reading tasks.',
        isActive: true,
        created_by: 1,
        updated_by: 1,
        created_at: '2025-05-20T08:25:00Z',
        updated_at: '2025-05-20T08:25:00Z',
        options: ['true', 'false'],
        timeLimit: 10,
        points: 5
      }
    ]
  },
  
  {
    _id: 2,
    title: 'Data Description',
    date: '2025-06-12',
    isActive: true,
    status: 'Not started',
    created_by: 2,
    updated_by: 2,
    created_at: '2025-05-22T09:00:00Z',
    updated_at: '2025-05-28T14:20:00Z',
    questions: [
      {
        _id: 4,
        quiz_id: 2,
        content: 'What is the minimum word count requirement for IELTS Writing Task 1?',
        isActive: true,
        created_by: 2,
        updated_by: 2,
        created_at: '2025-05-22T09:15:00Z',
        updated_at: '2025-05-22T09:15:00Z',
        options: ['120 words', '150 words', '200 words', '250 words'],
        timeLimit: 20,
        points: 10
      },
      {
        _id: 5,
        quiz_id: 2,
        content: 'Fill in the blank: "The graph shows a _____ increase in unemployment rates from 2020 to 2021."',
        isActive: true,
        created_by: 2,
        updated_by: 2,
        created_at: '2025-05-22T09:20:00Z',
        updated_at: '2025-05-22T09:20:00Z',
        options: ['significant', 'slight', 'dramatic', 'steady'],
        timeLimit: 25,
        points: 15
      },
      {
        _id: 6,
        quiz_id: 2,
        content: 'In IELTS Writing Task 1, you should give your personal opinion about the data presented.',
        isActive: true,
        created_by: 2,
        updated_by: 2,
        created_at: '2025-05-22T09:25:00Z',
        updated_at: '2025-05-22T09:25:00Z',
        options: ['true', 'false'],
        timeLimit: 15,
        points: 5
      }
    ]
  },

  {
    _id: 3,
    title: 'Long Turn',
    date: '2025-06-15',
    isActive: false,
    status: 'Done',
    created_by: 1,
    updated_by: 3,
    created_at: '2025-05-25T10:00:00Z',
    updated_at: '2025-06-01T16:45:00Z',
    questions: [
      {
        _id: 7,
        quiz_id: 3,
        content: 'How long should you speak for in IELTS Speaking Part 2?',
        isActive: true,
        created_by: 1,
        updated_by: 1,
        created_at: '2025-05-25T10:15:00Z',
        updated_at: '2025-05-25T10:15:00Z',
        options: ['30 seconds - 1 minute', '1-2 minutes', '2-3 minutes', '3-4 minutes'],
        timeLimit: 30,
        points: 20
      },
      {
        _id: 8,
        quiz_id: 3,
        content: 'Complete the phrase: "I\'d like to talk about a time when I _____ a difficult decision."',
        isActive: true,
        created_by: 1,
        updated_by: 1,
        created_at: '2025-05-25T10:20:00Z',
        updated_at: '2025-05-25T10:20:00Z',
        options: ['made', 'took', 'had', 'faced'],
        timeLimit: 20,
        points: 15
      },
      {
        _id: 9,
        quiz_id: 3,
        content: 'You get 1 minute to prepare notes before speaking in IELTS Speaking Part 2.',
        isActive: true,
        created_by: 1,
        updated_by: 1,
        created_at: '2025-05-25T10:25:00Z',
        updated_at: '2025-05-25T10:25:00Z',
        options: ['true', 'false'],
        timeLimit: 10,
        points: 10
      }
    ]
  },

  {
    _id: 4,
    title: 'Section Types and Strategies',
    date: '2025-06-18',
    isActive: true,
    status: 'Can not be started',
    created_by: 3,
    updated_by: 1,
    created_at: '2025-05-28T13:45:00Z',
    updated_at: '2025-06-02T09:20:00Z',
    questions: [
      {
        _id: 10,
        quiz_id: 4,
        content: 'Which section of IELTS Listening typically features an academic lecture?',
        isActive: true,
        created_by: 3,
        updated_by: 3,
        created_at: '2025-05-28T14:00:00Z',
        updated_at: '2025-05-28T14:00:00Z',
        options: ['Section 1', 'Section 2', 'Section 3', 'Section 4'],
        timeLimit: 20,
        points: 10
      },
      {
        _id: 11,
        quiz_id: 4,
        content: 'Fill in the gap: "The total number of questions in IELTS Listening is _____."',
        isActive: true,
        created_by: 3,
        updated_by: 3,
        created_at: '2025-05-28T14:05:00Z',
        updated_at: '2025-05-28T14:05:00Z',
        options: [],
        timeLimit: 15,
        points: 20
      },
      {
        _id: 12,
        quiz_id: 4,
        content: 'You can listen to each recording twice in the IELTS Listening test.',
        isActive: true,
        created_by: 3,
        updated_by: 3,
        created_at: '2025-05-28T14:10:00Z',
        updated_at: '2025-05-28T14:10:00Z',
        options: ['true', 'false'],
        timeLimit: 10,
        points: 5
      }
    ]
  },

  {
    _id: 5,
    title: 'Complex Sentences and Cohesion',
    date: '2025-06-20',
    isActive: true,
    status: 'Can not be started',
    created_by: 2,
    updated_by: 2,
    created_at: '2025-05-30T15:30:00Z',
    updated_at: '2025-06-03T10:15:00Z',
    questions: [
      {
        _id: 13,
        quiz_id: 5,
        content: 'Which of the following is a subordinating conjunction?',
        isActive: true,
        created_by: 2,
        updated_by: 2,
        created_at: '2025-05-30T15:45:00Z',
        updated_at: '2025-05-30T15:45:00Z',
        options: ['However', 'Therefore', 'Although', 'Furthermore'],
        timeLimit: 20,
        points: 10
      },
      {
        _id: 14,
        quiz_id: 5,
        content: 'Complete the sentence: "_____ the weather was terrible, we decided to go hiking."',
        isActive: true,
        created_by: 2,
        updated_by: 2,
        created_at: '2025-05-30T15:50:00Z',
        updated_at: '2025-05-30T15:50:00Z',
        options: ['Although', 'Despite', 'In spite of', 'While'],
        timeLimit: 25,
        points: 15
      },
      {
        _id: 15,
        quiz_id: 5,
        content: 'Using a variety of sentence structures can improve your IELTS Writing score.',
        isActive: true,
        created_by: 2,
        updated_by: 2,
        created_at: '2025-05-30T15:55:00Z',
        updated_at: '2025-05-30T15:55:00Z',
        options: ['true', 'false'],
        timeLimit: 15,
        points: 5
      }
    ]
  },

  {
    _id: 6,
    title: 'Academic Word List',
    date: '2025-06-22',
    isActive: true,
    status: 'Not started',
    created_by: 1,
    updated_by: 1,
    created_at: '2025-06-01T11:00:00Z',
    updated_at: '2025-06-05T09:30:00Z',
    questions: [
      {
        _id: 16,
        quiz_id: 6,
        content: 'What does "constitute" mean?',
        isActive: true,
        created_by: 1,
        updated_by: 1,
        created_at: '2025-06-01T11:15:00Z',
        updated_at: '2025-06-01T11:15:00Z',
        options: [
          'To destroy or eliminate',
          'To form or make up',
          'To question or doubt',
          'To separate or divide'
        ],
        timeLimit: 25,
        points: 10
      },
      {
        _id: 17,
        quiz_id: 6,
        content: 'Fill in the blank: "The data _____ a clear pattern of economic growth."',
        isActive: true,
        created_by: 1,
        updated_by: 1,
        created_at: '2025-06-01T11:20:00Z',
        updated_at: '2025-06-01T11:20:00Z',
        options: ['shows', 'illustrates', 'indicates', 'demonstrates'],
        timeLimit: 20,
        points: 15
      },
      {
        _id: 18,
        quiz_id: 6,
        content: 'Academic vocabulary is more important for IELTS Writing than Speaking.',
        isActive: true,
        created_by: 1,
        updated_by: 1,
        created_at: '2025-06-01T11:25:00Z',
        updated_at: '2025-06-01T11:25:00Z',
        options: ['true', 'false'],
        timeLimit: 15,
        points: 5
      }
    ]
  },

  {
    _id: 7,
    title: 'Essay Structure',
    date: '2025-06-25',
    isActive: true,
    status: 'Can not be started',
    created_by: 3,
    updated_by: 2,
    created_at: '2025-06-03T14:00:00Z',
    updated_at: '2025-06-07T10:45:00Z',
    questions: [
      {
        _id: 19,
        quiz_id: 7,
        content: 'What is the recommended minimum word count for IELTS Writing Task 2?',
        isActive: true,
        created_by: 3,
        updated_by: 3,
        created_at: '2025-06-03T14:15:00Z',
        updated_at: '2025-06-03T14:15:00Z',
        options: ['200 words', '250 words', '300 words', '350 words'],
        timeLimit: 20,
        points: 10
      },
      {
        _id: 20,
        quiz_id: 7,
        content: 'Complete the thesis statement: "This essay will _____ both sides of the argument before reaching a conclusion."',
        isActive: true,
        created_by: 3,
        updated_by: 3,
        created_at: '2025-06-03T14:20:00Z',
        updated_at: '2025-06-03T14:20:00Z',
        options: [],
        timeLimit: 30,
        points: 15
      },
      {
        _id: 21,
        quiz_id: 7,
        content: 'A strong conclusion should introduce new arguments not mentioned in the body paragraphs.',
        isActive: true,
        created_by: 3,
        updated_by: 3,
        created_at: '2025-06-03T14:25:00Z',
        updated_at: '2025-06-03T14:25:00Z',
        options: ['true', 'false'],
        timeLimit: 15,
        points: 5
      }
    ]
  }
];

// Helper function to get all questions from quizzes
export const getAllQuestions = (): QuestionData[] => {
  return quizSampleData.flatMap(quiz => quiz.questions);
};

// Helper function to get questions by quiz_id
export const getQuestionsByQuizId = (quizId: number): QuestionData[] => {
  const quiz = quizSampleData.find(q => q._id === quizId);
  return quiz ? quiz.questions : [];
};

// Helper function to count total questions
export const getTotalQuestionsCount = (): number => {
  return quizSampleData.reduce((total, quiz) => total + quiz.questions.length, 0);
};

// Helper function to get quizzes by IELTS skill
export const getQuizzesBySkill = (skill: 'reading' | 'writing' | 'speaking' | 'listening' | 'grammar' | 'vocabulary'): QuizData[] => {
  const skillKeywords = {
    reading: ['reading', 'comprehension'],
    writing: ['writing', 'task', 'essay'],
    speaking: ['speaking', 'part'],
    listening: ['listening', 'section'],
    grammar: ['grammar', 'sentences'],
    vocabulary: ['vocabulary', 'word']
  };
  
  return quizSampleData.filter(quiz => 
    skillKeywords[skill].some(keyword => 
      quiz.title.toLowerCase().includes(keyword)
    )
  );
};