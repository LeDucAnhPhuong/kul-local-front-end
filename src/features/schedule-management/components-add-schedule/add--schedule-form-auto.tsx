'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { MultiSelect } from '@/components/ui/multi-select';
import { useGetClassesQuery } from '@/features/class-management/api.class';
import type { ClassData } from '@/features/class-management/data.class';

const formSchema = z.object({
  dayOfWeek: z.array(z.string()).nonempty('Please at least one item'),
  classId: z.array(z.string()).nonempty('Please at least one item'),
});

interface MyFormProps {
  onAdd: (data: z.infer<typeof formSchema>) => void;
  isLoading?: boolean;
}

export default function MyFormAuto({ onAdd, isLoading }: MyFormProps) {
  const { classList, isFetching_classes } = useGetClassesQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => ({
      classList: data?.data || [],
      isFetching_classes: isFetching,
    }),
  });
  // Replace with actual default class ID if needed
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dayOfWeek: ['Mon'],
      classId: [classList[0]?._id || ''],
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      onAdd(values);
    } catch (error) {
      console.error('Form submission error', error);
      toast.error('Failed to submit the form. Please try again.');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">
        <FormField
          control={form.control}
          name="dayOfWeek"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Day of week</FormLabel>
              <FormControl>
                <MultiSelect
                  options={[
                    { value: 'Mon', label: 'Monday' },
                    { value: 'Tue', label: 'Tuesday' },
                    { value: 'Wed', label: 'Wednesday' },
                    { value: 'Thu', label: 'Thursday' },
                    { value: 'Fri', label: 'Friday' },
                    { value: 'Sat', label: 'Saturday' },
                    { value: 'Sun', label: 'Sunday' },
                  ]}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  placeholder="Select frameworks"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="classId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class Name</FormLabel>
              <FormControl>
                <MultiSelect
                  options={classList.map((classItem: ClassData) => ({
                    value: classItem._id,
                    label: classItem.name,
                  }))}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  placeholder="Select class"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4 justify-center">
          <Button variant="secondary" type="button" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button variant="default" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
