export interface QuizData {
  _id: number;
  title: string;
  date: string;
  isActive: boolean;
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
  correct_answer: string;
  isActive: boolean;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  options: string[];
  type: 'multiple_choice' | 'true_false' | 'fill_blank';
  points: number;
}

export const quizSampleData: QuizData[] = [
  {
    _id: 1,
    title: 'Academic Text Comprehension',
    date: '2025-06-10',
    isActive: true,
    created_by: 1,
    updated_by: 1,
    created_at: '2025-05-20T08:00:00Z',
    updated_at: '2025-05-25T10:30:00Z',
    questions: [
      {
        _id: 1,
        quiz_id: 1,
        content: 'Which of the following is NOT a typical feature of academic texts?',
        correct_answer: 'Emotional language and personal opinions',
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
        type: 'multiple_choice',
        points: 10
      },
      {
        _id: 2,
        quiz_id: 1,
        content: 'Complete the sentence: "The research _____ that climate change is accelerating faster than previously predicted."',
        correct_answer: 'indicates',
        isActive: true,
        created_by: 1,
        updated_by: 1,
        created_at: '2025-05-20T08:20:00Z',
        updated_at: '2025-05-20T08:20:00Z',
        options: [],
        type: 'fill_blank',
        points: 15
      },
      {
        _id: 3,
        quiz_id: 1,
        content: 'Skimming and scanning are both effective reading strategies for IELTS Reading tasks.',
        correct_answer: 'true',
        isActive: true,
        created_by: 1,
        updated_by: 1,
        created_at: '2025-05-20T08:25:00Z',
        updated_at: '2025-05-20T08:25:00Z',
        options: ['true', 'false'],
        type: 'true_false',
        points: 5
      }
    ]
  },
  
  {
    _id: 2,
    title: 'Data Description',
    date: '2025-06-12',
    isActive: true,
    created_by: 2,
    updated_by: 2,
    created_at: '2025-05-22T09:00:00Z',
    updated_at: '2025-05-28T14:20:00Z',
    questions: [
      {
        _id: 4,
        quiz_id: 2,
        content: 'What is the minimum word count requirement for IELTS Writing Task 1?',
        correct_answer: '150 words',
        isActive: true,
        created_by: 2,
        updated_by: 2,
        created_at: '2025-05-22T09:15:00Z',
        updated_at: '2025-05-22T09:15:00Z',
        options: ['120 words', '150 words', '200 words', '250 words'],
        type: 'multiple_choice',
        points: 10
      },
      {
        _id: 5,
        quiz_id: 2,
        content: 'Fill in the blank: "The graph shows a _____ increase in unemployment rates from 2020 to 2021."',
        correct_answer: 'significant',
        isActive: true,
        created_by: 2,
        updated_by: 2,
        created_at: '2025-05-22T09:20:00Z',
        updated_at: '2025-05-22T09:20:00Z',
        options: [],
        type: 'fill_blank',
        points: 15
      },
      {
        _id: 6,
        quiz_id: 2,
        content: 'In IELTS Writing Task 1, you should give your personal opinion about the data presented.',
        correct_answer: 'false',
        isActive: true,
        created_by: 2,
        updated_by: 2,
        created_at: '2025-05-22T09:25:00Z',
        updated_at: '2025-05-22T09:25:00Z',
        options: ['true', 'false'],
        type: 'true_false',
        points: 5
      }
    ]
  },

  {
    _id: 3,
    title: 'Long Turn',
    date: '2025-06-15',
    isActive: false,
    created_by: 1,
    updated_by: 3,
    created_at: '2025-05-25T10:00:00Z',
    updated_at: '2025-06-01T16:45:00Z',
    questions: [
      {
        _id: 7,
        quiz_id: 3,
        content: 'How long should you speak for in IELTS Speaking Part 2?',
        correct_answer: '1-2 minutes',
        isActive: true,
        created_by: 1,
        updated_by: 1,
        created_at: '2025-05-25T10:15:00Z',
        updated_at: '2025-05-25T10:15:00Z',
        options: ['30 seconds - 1 minute', '1-2 minutes', '2-3 minutes', '3-4 minutes'],
        type: 'multiple_choice',
        points: 20
      },
      {
        _id: 8,
        quiz_id: 3,
        content: 'Complete the phrase: "I\'d like to talk about a time when I _____ a difficult decision."',
        correct_answer: 'had to make',
        isActive: true,
        created_by: 1,
        updated_by: 1,
        created_at: '2025-05-25T10:20:00Z',
        updated_at: '2025-05-25T10:20:00Z',
        options: [],
        type: 'fill_blank',
        points: 15
      },
      {
        _id: 9,
        quiz_id: 3,
        content: 'You get 1 minute to prepare notes before speaking in IELTS Speaking Part 2.',
        correct_answer: 'true',
        isActive: true,
        created_by: 1,
        updated_by: 1,
        created_at: '2025-05-25T10:25:00Z',
        updated_at: '2025-05-25T10:25:00Z',
        options: ['true', 'false'],
        type: 'true_false',
        points: 10
      }
    ]
  },

  {
    _id: 4,
    title: 'Section Types and Strategies',
    date: '2025-06-18',
    isActive: true,
    created_by: 3,
    updated_by: 1,
    created_at: '2025-05-28T13:45:00Z',
    updated_at: '2025-06-02T09:20:00Z',
    questions: [
      {
        _id: 10,
        quiz_id: 4,
        content: 'Which section of IELTS Listening typically features an academic lecture?',
        correct_answer: 'Section 4',
        isActive: true,
        created_by: 3,
        updated_by: 3,
        created_at: '2025-05-28T14:00:00Z',
        updated_at: '2025-05-28T14:00:00Z',
        options: ['Section 1', 'Section 2', 'Section 3', 'Section 4'],
        type: 'multiple_choice',
        points: 10
      },
      {
        _id: 11,
        quiz_id: 4,
        content: 'Fill in the gap: "The total number of questions in IELTS Listening is _____."',
        correct_answer: '40',
        isActive: true,
        created_by: 3,
        updated_by: 3,
        created_at: '2025-05-28T14:05:00Z',
        updated_at: '2025-05-28T14:05:00Z',
        options: [],
        type: 'fill_blank',
        points: 20
      },
      {
        _id: 12,
        quiz_id: 4,
        content: 'You can listen to each recording twice in the IELTS Listening test.',
        correct_answer: 'false',
        isActive: true,
        created_by: 3,
        updated_by: 3,
        created_at: '2025-05-28T14:10:00Z',
        updated_at: '2025-05-28T14:10:00Z',
        options: ['true', 'false'],
        type: 'true_false',
        points: 5
      }
    ]
  },

  {
    _id: 5,
    title: 'Complex Sentences and Cohesion',
    date: '2025-06-20',
    isActive: true,
    created_by: 2,
    updated_by: 2,
    created_at: '2025-05-30T15:30:00Z',
    updated_at: '2025-06-03T10:15:00Z',
    questions: [
      {
        _id: 13,
        quiz_id: 5,
        content: 'Which of the following is a subordinating conjunction?',
        correct_answer: 'Although',
        isActive: true,
        created_by: 2,
        updated_by: 2,
        created_at: '2025-05-30T15:45:00Z',
        updated_at: '2025-05-30T15:45:00Z',
        options: ['However', 'Therefore', 'Although', 'Furthermore'],
        type: 'multiple_choice',
        points: 10
      },
      {
        _id: 14,
        quiz_id: 5,
        content: 'Complete the sentence: "_____ the weather was terrible, we decided to go hiking."',
        correct_answer: 'Despite',
        isActive: true,
        created_by: 2,
        updated_by: 2,
        created_at: '2025-05-30T15:50:00Z',
        updated_at: '2025-05-30T15:50:00Z',
        options: [],
        type: 'fill_blank',
        points: 15
      },
      {
        _id: 15,
        quiz_id: 5,
        content: 'Using a variety of sentence structures can improve your IELTS Writing score.',
        correct_answer: 'true',
        isActive: true,
        created_by: 2,
        updated_by: 2,
        created_at: '2025-05-30T15:55:00Z',
        updated_at: '2025-05-30T15:55:00Z',
        options: ['true', 'false'],
        type: 'true_false',
        points: 5
      }
    ]
  },

  {
    _id: 6,
    title: 'Academic Word List',
    date: '2025-06-22',
    isActive: true,
    created_by: 1,
    updated_by: 1,
    created_at: '2025-06-01T11:00:00Z',
    updated_at: '2025-06-05T09:30:00Z',
    questions: [
      {
        _id: 16,
        quiz_id: 6,
        content: 'What does "constitute" mean?',
        correct_answer: 'To form or make up',
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
        type: 'multiple_choice',
        points: 10
      },
      {
        _id: 17,
        quiz_id: 6,
        content: 'Fill in the blank: "The data _____ a clear pattern of economic growth."',
        correct_answer: 'reveals',
        isActive: true,
        created_by: 1,
        updated_by: 1,
        created_at: '2025-06-01T11:20:00Z',
        updated_at: '2025-06-01T11:20:00Z',
        options: [],
        type: 'fill_blank',
        points: 15
      },
      {
        _id: 18,
        quiz_id: 6,
        content: 'Academic vocabulary is more important for IELTS Writing than Speaking.',
        correct_answer: 'false',
        isActive: true,
        created_by: 1,
        updated_by: 1,
        created_at: '2025-06-01T11:25:00Z',
        updated_at: '2025-06-01T11:25:00Z',
        options: ['true', 'false'],
        type: 'true_false',
        points: 5
      }
    ]
  },

  {
    _id: 7,
    title: 'Essay Structure',
    date: '2025-06-25',
    isActive: true,
    created_by: 3,
    updated_by: 2,
    created_at: '2025-06-03T14:00:00Z',
    updated_at: '2025-06-07T10:45:00Z',
    questions: [
      {
        _id: 19,
        quiz_id: 7,
        content: 'What is the recommended minimum word count for IELTS Writing Task 2?',
        correct_answer: '250 words',
        isActive: true,
        created_by: 3,
        updated_by: 3,
        created_at: '2025-06-03T14:15:00Z',
        updated_at: '2025-06-03T14:15:00Z',
        options: ['200 words', '250 words', '300 words', '350 words'],
        type: 'multiple_choice',
        points: 10
      },
      {
        _id: 20,
        quiz_id: 7,
        content: 'Complete the thesis statement: "This essay will _____ both sides of the argument before reaching a conclusion."',
        correct_answer: 'examine',
        isActive: true,
        created_by: 3,
        updated_by: 3,
        created_at: '2025-06-03T14:20:00Z',
        updated_at: '2025-06-03T14:20:00Z',
        options: [],
        type: 'fill_blank',
        points: 15
      },
      {
        _id: 21,
        quiz_id: 7,
        content: 'A strong conclusion should introduce new arguments not mentioned in the body paragraphs.',
        correct_answer: 'false',
        isActive: true,
        created_by: 3,
        updated_by: 3,
        created_at: '2025-06-03T14:25:00Z',
        updated_at: '2025-06-03T14:25:00Z',
        options: ['true', 'false'],
        type: 'true_false',
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