'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import PairKeyQuestion from './pair-key-question';
import { useParams } from 'react-router-dom';
import { useGetQuestionByQuizIdQuery } from '@/features/teacher/components/make-quiz/api.question';
import { skipToken } from '@reduxjs/toolkit/query';
import { QuestionTypeEnum } from '@/features/teacher/components/make-quiz/question.type';
import SingleChoiceQuestion from './single-choice';
import MultipleChoiceQuestion from './mutiple-choice';
import FillBlankQuestion from './fill-blank';
import SelectInTextQuestion from './select-in-text';
import { useSubmitQuizMutation } from './api.submit-quiz';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import useRouter from '@/hooks/use-router';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CircularProgress } from './circel-result';

interface Answer {
  questionId: string;
  selectedOption?: string;
  selectedOptions?: string[];
  matchedPairs?: { left: string; right: string }[];
  textAnswers?: string[];
  leftOrder?: string[];
  rightOrder?: string[];
}

interface Question {
  quizId: string;
  type: QuestionTypeEnum;
  questionText: string;
  options: {
    option: string[] | null;
    correctAnswers: string[] | null;
  };
  pairs: {
    left: string[] | null;
    right: string[] | null;
    correctAnswers: [] | null;
  };
  fillInBlank: {
    content: string | null;
    correctAnswers: string[] | null;
  };
  selectContent: {
    content: string | null;
    options: string[] | null;
  };
  id: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  createdBy: string | null;
  updatedBy: string | null;
}

export default function QuizApp() {
  const { id } = useParams();
  const route = useRouter();

  const [submitQuiz, { isLoading }] = useSubmitQuizMutation();
  const { questions, isFetching } = useGetQuestionByQuizIdQuery(id ? { id } : skipToken, {
    selectFromResult: ({ data, isFetching }) => ({
      questions: data?.data || [], // Fallback to sample data if no data is available
      isFetching,
    }),
  });
  const [score, setScore] = useState<number | null>(null);

  const activeQuestions: Question[] = questions.filter((q: Question) => q.isActive);

  const [answers, setAnswers] = useState<Answer[]>(
    activeQuestions.map((q) => ({
      questionId: q.id,
      selectedOption: '',
      selectedOptions: [],
      matchedPairs: [],
      textAnswers: [],
      leftOrder: [],
      rightOrder: [],
    })),
  );

  useEffect(() => {
    if (!!activeQuestions.length) {
      setAnswers(
        activeQuestions.map((q) => ({
          questionId: q.id,
          selectedOption: '',
          selectedOptions: [],
          matchedPairs: [],
          textAnswers: [],
          leftOrder: [],
          rightOrder: [],
        })),
      );
    }
  }, [JSON.stringify(activeQuestions)]);

  const updateAnswer = (questionIndex: number, updates: Partial<Answer>) => {
    setAnswers((prev) =>
      prev.map((answer, index) => (index === questionIndex ? { ...answer, ...updates } : answer)),
    );
  };

  const handleCancle = () => {
    route.replace('/quizzes-student');
  };

  const isQuestionCompleted = (question: any, answer: Answer) => {
    switch (question.type) {
      case 'SingleChoice':
        return answer?.selectedOption && answer?.selectedOption.trim() !== '';
      case 'MultipleChoice':
        return answer?.selectedOptions && answer?.selectedOptions.length > 0;
      case 'Fillblank':
        const blankCount = question.fillInBlank.content.split('[]').length - 1;
        return (
          answer?.textAnswers &&
          answer?.textAnswers?.length === blankCount &&
          answer?.textAnswers?.every((text: string) => text && text.trim() !== '')
        );
      case 'PairKey':
        return (
          answer?.matchedPairs &&
          answer?.matchedPairs?.length === question.pairs.left.length &&
          answer?.matchedPairs?.every(
            (pair: { left: string; right: string }) => pair.left && pair.right,
          )
        );
      case 'SelectInText':
        const optionCount = question.selectContent.options.length;
        return (
          answer?.textAnswers &&
          answer?.textAnswers?.length === optionCount &&
          answer?.textAnswers?.every((text: string) => text && text.trim() !== '')
        );
      default:
        return false;
    }
  };

  const onSubmit = async () => {
    const result = { answers };
    const toastId = toast.loading('Submitting your answers...');
    try {
      const res = await submitQuiz({
        quizId: id,
        answers,
      });
      setScore(res?.data?.score);
      toast.success('Quiz submitted successfully!', { id: toastId });
    } catch (error) {
      toast.error('Failed to submit quiz. Please try again.', { id: toastId });
    }

    console.log('result', result);
  };

  const scrollToQuestion = (index: number) => {
    const element = document.getElementById(`question-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {isFetching ? (
        <div className="flex justify-center items-center h-screen w-full">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Dialog open={score !== null}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Quiz Result</DialogTitle>
                <DialogDescription>
                  <div className="flex w-full h-[400px] items-center justify-center">
                    <CircularProgress percent={score ?? 0} />
                  </div>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button onClick={handleCancle}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Quiz Navigation</CardTitle>
                <CardDescription>{activeQuestions.length} questions total</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {activeQuestions.map((question, index) => {
                    const isCompleted = isQuestionCompleted(question, answers[index]);
                    return (
                      <Button
                        key={question.id}
                        variant="ghost"
                        className={`w-full justify-start text-left h-auto p-3 ${
                          isCompleted
                            ? 'bg-green-50 hover:bg-green-100 dark:bg-green-950/20 dark:hover:bg-green-950/30'
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => scrollToQuestion(index)}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                              isCompleted ? 'bg-green-500 text-white' : 'bg-primary/10'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <span>{index + 1}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-medium truncate ${
                                isCompleted ? 'text-green-700 dark:text-green-300' : ''
                              }`}
                            >
                              Question {index + 1}
                            </p>
                            <p
                              className={`text-xs capitalize ${
                                isCompleted
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-muted-foreground'
                              }`}
                            >
                              {question.type.replace(/([A-Z])/g, ' $1').trim()}
                            </p>
                          </div>
                          {isCompleted && (
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          )}
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {activeQuestions.map((question: Question, index: number) => (
                <Card key={question.id} id={`question-${index}`} className="scroll-mt-6">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                          isQuestionCompleted(question, answers[index])
                            ? 'bg-green-500 text-white'
                            : 'bg-primary text-primary-foreground'
                        }`}
                      >
                        {isQuestionCompleted(question, answers[index]) ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                        <CardDescription className="capitalize">
                          {question.type.replace(/([A-Z])/g, ' $1').trim()}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <QuestionRenderer
                      question={question}
                      questionIndex={index}
                      answer={answers[index]}
                      updateAnswer={updateAnswer}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Submit Button */}
            <Card className="mt-8">
              <CardContent className="pt-6">
                <div className="flex justify-center gap-10">
                  <Button
                    onClick={handleCancle}
                    variant="outline"
                    isLoading={isLoading}
                    size="lg"
                    className="px-8"
                  >
                    Cancel
                  </Button>
                  <Button onClick={onSubmit} isLoading={isLoading} size="lg" className="px-8">
                    Submit Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

function QuestionRenderer({ question, questionIndex, answer, updateAnswer }: any) {
  switch (question.type) {
    case QuestionTypeEnum.SingleChoice:
      return (
        <SingleChoiceQuestion
          question={question}
          questionIndex={questionIndex}
          answer={answer}
          updateAnswer={updateAnswer}
        />
      );
    case QuestionTypeEnum.MultipleChoice:
      return (
        <MultipleChoiceQuestion
          question={question}
          questionIndex={questionIndex}
          answer={answer}
          updateAnswer={updateAnswer}
        />
      );
    case QuestionTypeEnum.Fillblank:
      return (
        <FillBlankQuestion
          question={question}
          questionIndex={questionIndex}
          answer={answer}
          updateAnswer={updateAnswer}
        />
      );
    case QuestionTypeEnum.PairKey:
      return (
        <PairKeyQuestion
          question={question}
          questionIndex={questionIndex}
          answer={answer}
          updateAnswer={updateAnswer}
        />
      );
    case QuestionTypeEnum.SelectInText:
      return (
        <SelectInTextQuestion
          question={question}
          questionIndex={questionIndex}
          answer={answer}
          updateAnswer={updateAnswer}
        />
      );
    default:
      return <div>Unknown question type</div>;
  }
}
