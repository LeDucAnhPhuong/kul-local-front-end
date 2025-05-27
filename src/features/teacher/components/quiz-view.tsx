import { useEffect, useState } from 'react';
import TitlePage from '@/components/ui/title-page';
import { contests } from '../data.quiz-ui';
import { ContestColumns } from '../columns/quiz.columns';
import DataCard from '@/components/ui/data-card';
import type { Contest } from '../columns/quiz.columns';
import CreateQuizDialog from './createQuiz';
import ConfirmDialog from './confirmDialog';
import { useNavigate } from 'react-router-dom';
function QuizView() {
  const [quizzes, setQuizzes] = useState<Contest[]>([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<Contest | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('quizzes');
    const localQuizzes: Contest[] = stored ? JSON.parse(stored) : [];
    setQuizzes([...contests, ...localQuizzes]);
  }, []);

  const handleDeleteClick = (quiz: Contest) => {
    setQuizToDelete(quiz);
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (quizToDelete) {
      const updated = quizzes.filter((q) => q.id !== quizToDelete.id);
      setQuizzes(updated);
      localStorage.setItem('quizzes', JSON.stringify(updated));
      setQuizToDelete(null);
      setConfirmOpen(false);
    }
  };

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage title="Schedule" contentHref="Create quiz" onClick={() => setOpen(true)} />
      <DataCard onRowClick={() => navigate(`/AddQuestion`)} data={quizzes} columns={ContestColumns(handleDeleteClick)} />
      <CreateQuizDialog
        open={open}
        setOpen={setOpen}
        onCreate={(newQuiz) => {
          const updated = [...quizzes, newQuiz];
          setQuizzes(updated);
          localStorage.setItem('quizzes', JSON.stringify(updated));
        }}
      /><div onClick={(e) => e.stopPropagation()}>
      <ConfirmDialog
        open={confirmOpen}
        title={`Delete quiz "${quizToDelete?.title}"?`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
      /></div>
    </div>
  );
}

export default QuizView;
