import { useForm, Controller } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { SmartDatetimeInput } from '@/components/ui/smart-datetime-input';
import { useGetQuizByIdQuery, useUpdateQuizMutation } from './quiz.api';
import { toast } from 'sonner';
import { skipToken } from '@reduxjs/toolkit/query';
import { useEffect } from 'react';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string;
  quizId?: string | null;
};

type FormValues = {
  title: string;
  date: Date;
  due: Date;
  isPublic: boolean;
};

// Component hiển thị lỗi đơn giản
const FormFieldError = ({ message }: { message?: string }) =>
  message ? <p className="text-sm text-red-500 mt-1">{message}</p> : null;

function UpdateQuizDialog({ open, setOpen, title, quizId }: Props) {
  const [updateQuiz, { isLoading }] = useUpdateQuizMutation();
  const { data: quizData } = useGetQuizByIdQuery(quizId ? { id: quizId } : skipToken, {
    selectFromResult: ({ data }) => ({
      data: data?.data || null,
    }),
  }); // Replace with actual quiz ID

  const {
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: '',
      date: new Date(),
      due: (() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
      })(),
      isPublic: false,
    },
    mode: 'onChange',
  });

  const date = watch('date');

  useEffect(() => {
    if (quizData) {
      reset({
        title: quizData.title,
        date: new Date(quizData.date),
        due: new Date(quizData.due),
        isPublic: quizData.isPublic,
      });
    }
  }, [quizData]);

  const onSubmit = async (data: FormValues) => {
    const toastId = toast.loading('Creating quiz...');
    try {
      await updateQuiz({
        id: quizId || '',
        data: {
          ...data,
          date: data.date.toISOString(),
          due: data.due.toISOString(),
        },
      }).unwrap();

      toast.success('Quiz updated successfully!', { id: toastId });
      setOpen(false);
      reset();
    } catch (error) {
      toast.error('Failed to updated quiz. Please try again.', { id: toastId });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <Controller
            control={control}
            name="title"
            rules={{ required: 'Title is required' }}
            render={({ field }) => (
              <>
                <Input placeholder="Quiz title..." {...field} />
                <FormFieldError message={errors.title?.message} />
              </>
            )}
          />

          <div>
            <label className="block mb-1 text-sm">Start date</label>
            <Controller
              control={control}
              name="date"
              rules={{ required: 'Start date is required' }}
              render={({ field }) => (
                <SmartDatetimeInput value={field.value} onValueChange={field.onChange} enableDate />
              )}
            />
            <FormFieldError message={errors.date?.message} />
          </div>

          <div>
            <label className="block mb-1 text-sm">Due date</label>
            <Controller
              control={control}
              name="due"
              rules={{ required: 'Due date is required' }}
              render={({ field }) => (
                <SmartDatetimeInput
                  disabledDateTimeFrom={date}
                  value={field.value}
                  onValueChange={field.onChange}
                  enableDate
                />
              )}
            />
            <FormFieldError message={errors.due?.message} />
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              control={control}
              name="isPublic"
              render={({ field }) => (
                <>
                  <Checkbox
                    id="isPublic"
                    checked={field.value}
                    onCheckedChange={(val) => field.onChange(Boolean(val))}
                  />
                  <label htmlFor="isPublic" className="text-sm">
                    Public quiz
                  </label>
                </>
              )}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              isLoading={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateQuizDialog;
