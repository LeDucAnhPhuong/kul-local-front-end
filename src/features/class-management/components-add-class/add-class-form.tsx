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
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router';

const formSchema = z
  .object({
    name: z.string().min(1, 'Class name is required'),
    start_time: z.date({
      required_error: 'Start day is required',
    }),
    end_time: z.date({
      required_error: 'End day is required',
    }),
  })
  .refine(
    (data) => {
      return data.end_time > data.start_time;
    },
    {
      message: 'End day must be after start day',
      path: ['end_time'],
    },
  );

interface MyFormProps {
  onAdd: (data: z.infer<typeof formSchema>) => void;
  isLoading?: boolean;
}

export default function MyForm({ onAdd, isLoading }: MyFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      start_time: undefined,
      end_time: undefined,
    },
  });
  const navigate = useNavigate();
  function onSubmit(values: z.infer<typeof formSchema>) {
    onAdd({
      name: values.name,
      start_time: values.start_time,
      end_time: values.end_time,
    });
    try {
      console.log(values);
      navigate('/class-management');
    } catch (error) {
      console.error('Error submitting form:', error);
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
              <FormLabel>Class Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter class name..." type="text" {...field} />
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
                <FormItem className="flex flex-col">
                  <FormLabel>Start Day</FormLabel>
                  <Popover>
                    <PopoverTrigger>
                      <FormControl>
                        <Button
                          type="button"
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

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
                <FormItem className="flex flex-col">
                  <FormLabel>End Day</FormLabel>
                  <Popover>
                    <PopoverTrigger>
                      <FormControl>
                        <Button
                          type="button"
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
          <Button variant="default" type="submit" disabled={isLoading}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
