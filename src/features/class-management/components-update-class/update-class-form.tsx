'use client';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useParams } from 'react-router';
import { useGetClassInfoQuery } from '../api.class';
import { useEffect } from 'react';

const formSchema = z.object({
  name: z.string().min(1, 'Class name is required'),
});

interface MyFormProps {
  onUpdate: (data: { name: string; start_time: string; end_time: string }) => void;
  isLoading?: boolean;
}

export default function MyForm({ onUpdate, isLoading }: MyFormProps) {
  const { id } = useParams();

  const { classInfo, isFetching } = useGetClassInfoQuery(id, {
    selectFromResult: ({ data, isFetching }) => ({
      classInfo: data?.data,
      isFetching,
    }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      onUpdate({
        name: values.name,
        start_time: classInfo.startTime,
        end_time: classInfo.endTime,
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit the form. Please try again.');
    }
  }

  useEffect(() => {
    if (classInfo) {
      form.reset({
        name: classInfo.name,
      });
    }
  }, [classInfo]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter class name..." type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4 justify-center">
          <Button variant="secondary" type="button" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button variant="default" type="submit" disabled={isLoading}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
