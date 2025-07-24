import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AssignmentEnum, type AssignmentType } from '../types/assignment';
import { SmartDatetimeInput } from '@/components/ui/smart-datetime-input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetClassesQuery } from '@/features/tedteam/api.tedteam';
import CustomEditor from '@/components/ui/custom-editor';

type AssignmentForm = {
  title: string;
  type: AssignmentType;
  startTime: Date;
  dueTime: Date;
  content: string;
  classId: string;
};

export function AssignmentCreateModal({
  open,
  onClose,
  loading,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  loading: boolean;
  onSubmit: (data: AssignmentForm) => Promise<void>;
}) {
  const form = useForm<AssignmentForm>({
    defaultValues: {
      title: '',
      type: AssignmentEnum.Check1,
      startTime: new Date(),
      dueTime: new Date(),
    },
  });

  const { classList, isFetching_classes } = useGetClassesQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => ({
      classList: data?.data || [],
      isFetching_classes: isFetching,
    }),
  });

  const startTime = form.watch('startTime');

  const handleFormSubmit = async (data: AssignmentForm) => {
    await onSubmit(data);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-xl p-0">
          <DialogHeader>
            <DialogTitle className="p-4">Create Assignment</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[500px]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 p-4">
                <div className="grid gap-2">
                  <Label>Title</Label>
                  <FormField
                    name="title"
                    control={form.control}
                    rules={{ required: true }}
                    render={({ field }) => <Input {...field} placeholder="Assignment title" />}
                  />
                </div>

                <div className="grid gap-2 grid-cols-2">
                  <FormField
                    name="type"
                    control={form.control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select assignment type" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(AssignmentEnum).map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="classId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class Name</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a class name ..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {isFetching_classes ? (
                              <div className="p-2 text-gray-400">Loading classes...</div>
                            ) : classList.length === 0 ? (
                              <div className="p-2 text-gray-400">No classes found</div>
                            ) : (
                              classList.map((classItem: any) => (
                                <SelectItem key={classItem.id} value={classItem.id}>
                                  {classItem.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Start Time</Label>
                  <FormField
                    name="startTime"
                    control={form.control}
                    render={({ field }) => (
                      <SmartDatetimeInput
                        enableDate
                        value={field.value}
                        onValueChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Due Time</Label>
                  <FormField
                    name="dueTime"
                    control={form.control}
                    render={({ field }) => (
                      <SmartDatetimeInput
                        enableDate
                        disabledDateTimeFrom={startTime}
                        value={field.value}
                        onValueChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>File Upload</Label>
                  <FormField
                    name="content"
                    control={form.control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <CustomEditor content={field.value} onChange={field.onChange} />
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" isLoading={loading}>
                    Create
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
