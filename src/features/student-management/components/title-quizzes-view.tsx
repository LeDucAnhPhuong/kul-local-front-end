import TitlePage from '@/components/ui/title-page';
import { columns } from '../columns/title-quizzes';

import DataCard from '@/components/ui/data-card';
import { useGetQuizByStudentQuery } from '@/features/teacher/components/quiz/quiz.api';
import type { Quiz } from '@/features/teacher/components/quiz/quiz.type';

const QuizzesUI = () => {
  const { quizzes: rawQuizzes } = useGetQuizByStudentQuery(undefined, {
    selectFromResult: ({ data }) => ({
      quizzes: data?.data?.filter((item: Quiz) => item?.isActive) || [],
    }),
  });

  const statusOrder = ['not-yet', 'upcoming', 'cant_start', 'done'];
  const quizzes = [...rawQuizzes].sort(
    (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status),
  );

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage title="List Quizzes Title" />
      <DataCard data={quizzes} columns={columns} />
    </div>
  );
};

export default QuizzesUI;
