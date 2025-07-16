import  { useState } from 'react';
import {
  QuestionTypeEnum,
  type Question,
  type QuestionResponse,
  type QuestionTypeInfo,
} from './question.type';

import { QuestionTypePanel } from './question-type-panel';
import { QuestionCanvas } from './question-canvas';
import { useGetQuestionByQuizIdQuery } from './api.question';
import { skipToken } from '@reduxjs/toolkit/query';
import { useParams } from 'react-router-dom';

function mapQuestionDTO(dto: QuestionResponse): Question {
  const base = {
    id: dto.id, // hoặc dto.id nếu có
    type: dto.type,
    title: dto.questionText,
    isRequired: true,
  };

  switch (dto.type) {
    case QuestionTypeEnum.SingleChoice:
      return {
        ...base,
        type: QuestionTypeEnum.SingleChoice,
        options: dto.options?.option.map((opt, i) => ({ id: `${i}`, text: opt })) || [],
        correctAnswer:
          dto?.options?.option?.findIndex(
            (option) => option === dto?.options?.correctAnswers?.[0],
          ) || 0,
      };

    case QuestionTypeEnum.MultipleChoice:
      return {
        ...base,
        type: QuestionTypeEnum.MultipleChoice,
        options: dto.options?.option.map((opt, i) => ({ id: `${i}`, text: opt })) || [],
        correctAnswers:
          dto?.options?.option
            ?.map((option, index) => (dto?.options?.correctAnswers?.includes(option) ? index : -1))
            ?.filter((correctAnswer) => correctAnswer !== -1) || [],
      };

    case QuestionTypeEnum.PairKey:
      return {
        ...base,
        type: QuestionTypeEnum.PairKey,
        pairs: (dto.pairs?.left || []).map((left, index) => ({
          id: `${index}`,
          left,
          right: dto.pairs?.right[index] || '',
        })),
      };

    case QuestionTypeEnum.SelectInText:
      return {
        ...base,
        type: QuestionTypeEnum.SelectInText,
        sentence: dto.selectContent?.content || '',
        dropdowns:
          dto.selectContent?.options.map((opt, index) => ({
            id: `${index}`,
            options: opt.value,
            correctAnswer: opt.value.indexOf(opt.correctAnswer),
          })) || [],
      };

    case QuestionTypeEnum.Fillblank:
      return {
        ...base,
        type: QuestionTypeEnum.Fillblank,
        sentence: dto.fillInBlank?.content || '',
        correctAnswer: dto.fillInBlank?.correctAnswers || [],
      };
  }
}

function QuizModule() {
  const { quizId } = useParams<{ quizId: string }>();
  const { data: questionsDTO } = useGetQuestionByQuizIdQuery(quizId ? { id: quizId } : skipToken, {
    selectFromResult: ({ data }) => ({
      data: data?.data?.filter((item: QuestionResponse) => item?.isActive) || [],
    }),
  });

  const questions: Question[] = questionsDTO.map(mapQuestionDTO);
  const [_, setDraggedType] = useState<QuestionTypeInfo | null>(null);

  const handleDragStart = (type: QuestionTypeInfo) => {
    setDraggedType(type);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <QuestionCanvas questions={questions} />

        <QuestionTypePanel onDragStart={handleDragStart} />
      </div>
    </div>
  );
}

export default QuizModule;
