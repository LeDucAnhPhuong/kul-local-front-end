import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Contest } from '../../columns/quiz.columns';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onCreate: (newQuiz: Contest) => void;
};

function CreateQuizDialog({ open, setOpen, onCreate }: Props) {
  const [title, setTitle] = useState('');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const navigate = useNavigate();

  const handleCreate = () => {
    const now = new Date().toISOString();

    const newQuiz: Contest = {
      id: Date.now().toString(),
      title,
      status: 'upcoming',
      startAt,
      endAt,
      date: now,
      isActive: true,
      created_by: 'admin',
      topic: 'Speaking',
      updated_by: 'admin',
      created_at: now,
      updated_at: now,
    };

    onCreate(newQuiz);        // Gửi dữ liệu ra component cha
    setOpen(false);           // Đóng dialog
    setTimeout(() => {        // Tránh navigate quá sớm khi dialog chưa unmount
      navigate('/quiz');
    }, 100);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a New Quiz</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Quiz title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div>
            <label className="block mb-1 text-sm">Start date</label>
            <Input
              type="date"
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">End date</label>
            <Input
              type="date"
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreate} disabled={!title || !startAt || !endAt}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateQuizDialog;
