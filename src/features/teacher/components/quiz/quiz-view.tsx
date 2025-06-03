import { useEffect, useState } from 'react';
import TitlePage from '@/components/ui/title-page';
import { contests } from '../../data.quiz-ui';
import { ContestColumns } from '../../columns/quiz.columns';
import DataCard from '@/components/ui/data-card';
import type { Contest } from '../../columns/quiz.columns';
import CreateQuizDialog from './createQuiz';
import ConfirmDialog from './confirmDialog';
import SettingDialog from './setingDialog';
import { useNavigate } from 'react-router-dom';
function QuizView() {
  const [quizzes, setQuizzes] = useState<Contest[]>([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [quizToDOU, setQuizToDelete] = useState<Contest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('quizzes');
    const localQuizzes: Contest[] = stored ? JSON.parse(stored) : [];
    setQuizzes([...contests, ...localQuizzes]);
  }, []);

  const handleDeleteClick = (quiz: Contest) => {
    setQuizToDelete(quiz);
    setConfirmOpen(true);
  };
  const handleUpdateClick = (quiz: Contest) => {
    setQuizToDelete(quiz);
    setDialogOpen(true);
  };
  const handleDeleteConfirm = () => {
    if (quizToDOU) {
      const updated = quizzes.filter((q) => q.id !== quizToDOU.id);
      setQuizzes(updated);
      localStorage.setItem('quizzes', JSON.stringify(updated));
      setQuizToDelete(null);
      setConfirmOpen(false);
    }
  };

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage title="Schedule" contentHref="Create quiz" onClick={() => setOpen(true)} />
      <DataCard
        onRowClick={({ data }) => navigate(`/AddQuestion/${data.id}`)}
        data={quizzes}
        columns={ContestColumns(handleDeleteClick,handleUpdateClick)}
      />

      <CreateQuizDialog
        open={open}
        setOpen={setOpen}
        onCreate={(newQuiz) => {
          const updated = [...quizzes, newQuiz];
          setQuizzes(updated);
          localStorage.setItem('quizzes', JSON.stringify(updated));
        }}
      />
      <div onClick={(e) => e.stopPropagation()}>
        <ConfirmDialog
          open={confirmOpen}
          title={`Delete quiz "${quizToDOU?.title}"?`}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={handleDeleteConfirm}
        />
      </div>
      <div onClick={(e) => e.stopPropagation()}>
        <SettingDialog
          open={dialogOpen}
          setOpen={setDialogOpen}
          title={`Update quiz "${quizToDOU?.title}"?`}
        />
      </div>
    </div>
  );
}

export default QuizView;
