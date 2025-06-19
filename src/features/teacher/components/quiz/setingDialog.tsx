import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type Props = {
  open: boolean;
  title?: string;
  setOpen: (open: boolean) => void;
};

function SettingDialog({ open, title = 'Quiz Settings', setOpen }: Props) {
  const [quizTitle, setQuizTitle] = useState('');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md fle">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className=" gap-4 py-4 flex">
          <Input
            placeholder="Quiz title..."
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
          />
          <div>
            <div>
              <label className="block mb-1 text-sm">Start date</label>
              <Input type="date" value={startAt} onChange={(e) => setStartAt(e.target.value)} />
            </div>
            <div>
              <label className="block mb-1 text-sm">End date</label>
              <Input type="date" value={endAt} onChange={(e) => setEndAt(e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SettingDialog;
