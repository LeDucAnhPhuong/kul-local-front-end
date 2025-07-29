import { useState } from 'react';
import TitlePage from '@/components/ui/title-page';
import { ContestColumns } from '../../columns/quiz.columns';
import DataCard from '@/components/ui/data-card';
import CreateQuizDialog from './createQuiz';
import ConfirmDialog from './confirmDialog';
import SettingDialog from './setingDialog';
import { useNavigate } from 'react-router-dom';
import { useGetQuizByCoachQuery } from './quiz.api';
import type { Quiz } from './quiz.type';
function QuizView() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [quizToDOU, setQuizToDelete] = useState<Quiz | null>(null);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: quizzes } = useGetQuizByCoachQuery(undefined, {
    selectFromResult: ({ data }) => ({
      data:
        data?.data
          ?.filter((quiz: Quiz) => quiz?.isActive)
          ?.map((quiz: Quiz) => ({
            ...quiz,
            status:
              new Date(quiz?.date) > new Date()
                ? 'upcoming'
                : new Date(quiz?.due) > new Date()
                ? 'ongoing'
                : 'completed',
          })) || [],
    }),
  });

  const handleDeleteClick = (quiz: Quiz) => {
    setQuizToDelete(quiz);
    setQuizId(quiz.id);
    setConfirmOpen(true);
  };
  const handleUpdateClick = (quiz: Quiz) => {
    setQuizToDelete(quiz);
    setQuizId(quiz.id);
    setDialogOpen(true);
  };

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage title="Quiz" contentHref="Create quiz" onClick={() => setOpen(true)} />
      <DataCard
        onRowClick={({ data }) => navigate(`/make-quiz/${data.id}`)}
        data={quizzes}
        columns={ContestColumns(handleDeleteClick, handleUpdateClick)}
      />

      <CreateQuizDialog open={open} setOpen={setOpen} />
      <div onClick={(e) => e.stopPropagation()}>
        <ConfirmDialog
          open={confirmOpen}
          title={`Delete quiz "${quizToDOU?.title}"?`}
          onCancel={() => setConfirmOpen(false)}
          quizId={quizId}
        />
      </div>
      <div onClick={(e) => e.stopPropagation()}>
        <SettingDialog
          open={dialogOpen}
          setOpen={setDialogOpen}
          title={`Update quiz "${quizToDOU?.title}"?`}
          quizId={quizId}
        />
      </div>
    </div>
  );
}

export default QuizView;
