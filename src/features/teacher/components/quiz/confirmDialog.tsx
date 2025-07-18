// components/ui/confirm-dialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDeleteQuizMutation } from './quiz.api';
import { toast } from 'sonner';

type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  quizId?: string | null;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  quizId,
  onCancel,
}: ConfirmDialogProps) {
  const [deleteQuiz, { isLoading }] = useDeleteQuizMutation();

  const handleDeleteConfirm = async () => {
    const toastId = toast.loading('Deleting quiz...');
    try {
      if (!quizId) return;
      await deleteQuiz(quizId).unwrap();
      toast.success('Quiz deleted successfully', { id: toastId });
    } catch (error) {
      toast.error('Failed to delete quiz', { id: toastId });
    }
  };
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} isLoading={isLoading}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
