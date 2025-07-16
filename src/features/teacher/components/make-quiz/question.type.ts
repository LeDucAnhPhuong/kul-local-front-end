export interface BaseQuestion {
  id: string;
  type: QuestionType;
  title: string;
  isRequired: boolean;
}

export interface SingleChoiceQuestion extends BaseQuestion {
  type: 'SingleChoice';
  options: Option[];
  correctAnswer: number;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'MultipleChoice';
  options: Option[];
  correctAnswers: number[];
}

export interface MatchPairQuestion extends BaseQuestion {
  type: 'PairKey';
  pairs: MatchPair[];
}

export interface SelectAnswerQuestion extends BaseQuestion {
  type: 'SelectInText';
  sentence: string;
  dropdowns: SelectDropdown[];
}

export interface SelectDropdown {
  id: string;
  options: string[];
  correctAnswer: number;
}

export interface FillBlankQuestion extends BaseQuestion {
  type: 'Fillblank';
  sentence: string;
  correctAnswer: string[];
}

export type Question =
  | SingleChoiceQuestion
  | MultipleChoiceQuestion
  | MatchPairQuestion
  | SelectAnswerQuestion
  | FillBlankQuestion;

export interface QuestionDTO {
  quizId: string;
  type: QuestionType;
  questionText: string;
  options?: {
    option: string[];
    correctAnswers: string[];
  };
  pairs?: {
    left: string[];
    right: string[];
    correctAnswers: string[][];
  };
  selectContent?: {
    content: string;
    options: {
      value: string[];
      correctAnswer: string;
    }[];
  };
  fillInBlank?: {
    content: string;
    correctAnswers: string[];
  };
}

export interface QuestionResponse extends QuestionDTO {
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export type QuestionType = keyof typeof QuestionTypeEnum;

export const QuestionTypeEnum = {
  SingleChoice: 'SingleChoice',
  MultipleChoice: 'MultipleChoice',
  PairKey: 'PairKey',
  SelectInText: 'SelectInText',
  Fillblank: 'Fillblank',
} as const;

export type QuestionTypeEnum = (typeof QuestionTypeEnum)[keyof typeof QuestionTypeEnum];

export interface Option {
  id: string;
  text: string;
}

export interface MatchPair {
  id: string;
  left: string;
  right: string;
}

export interface QuestionTypeInfo {
  type: QuestionType;
  label: string;
  description: string;
  icon: string;
}
