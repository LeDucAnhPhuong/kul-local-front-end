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
import { Input } from '@/components/ui/input';
import { SmartDatetimeInput } from '@/components/ui/smart-datetime-input';
import { useNavigate } from 'react-router';

const formSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  start_time: z.date(),
  end_time: z.date(),
});

interface MyFormProps {
  onAdd: (data: z.infer<typeof formSchema>) => void;
  isLoading?: boolean;
}

export default function MyForm({ onAdd, isLoading }: MyFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      start_time: new Date(),
      end_time: new Date(),
    },
  });
  const navigate = useNavigate();
  function onSubmit(values: z.infer<typeof formSchema>) {
    onAdd({
      name: values.name,
      description: values.description,
      start_time: values.start_time,
      end_time: values.end_time,
    });
    try {
      console.log(values);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>,
      );
      navigate('/slot-management');
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slot Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter slot name..." type="text" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter description..." type="text" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="start_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <SmartDatetimeInput
                      value={
                        field.value.getTime() >= new Date().getTime() - 100
                          ? field.value
                          : undefined
                      }
                      onValueChange={field.onChange}
                      placeholder="e.g. Tomorrow morning 9am"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6">
            <FormField
              control={form.control}
              name="end_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <SmartDatetimeInput
                      value={field.value >= form.getValues('start_time') ? field.value : undefined}
                      onValueChange={field.onChange}
                      placeholder="e.g. Tomorrow morning 9am"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
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
