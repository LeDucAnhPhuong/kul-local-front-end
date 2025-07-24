'use client';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';
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
import { TimeOnlyInput } from './time-only-input';

const formSchema = z
  .object({
    name: z.string(),
    startTime: z.date({ message: 'Start time is required' }),
    endTime: z.date({ message: 'Invalid time format' }),
  })
  .refine(
    (data) => {
      return data.endTime >= data.startTime;
    },
    {
      message: 'End time must be greater than start time',
      path: ['endTime'],
    },
  );

interface MyFormProps {
  onAdd: (data: z.infer<typeof formSchema>) => void;
  isLoading?: boolean;
}

export default function MyForm({ onAdd }: MyFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      onAdd({
        name: values.name,
        startTime: values.startTime,
        endTime: values.endTime,
      });
      console.log(values);
    } catch (error) {
      console.error('Form submission error', error);
      toast.error('Failed to submit the form. Please try again.');
    }
  }

  const getThresholdTime = (date?: Date): string => {
    if (!date) return '12:00 AM';
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: 'UTC',
    });
  };

  const startTime = form.watch('startTime');

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

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <TimeOnlyInput
                      value={field.value}
                      onValueChange={field.onChange}
                      thresholdTime={'12:00 AM'}
                      placeholder="Enter start time (e.g. 5:00 AM)"
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
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(startTime ?? 'text-muted-foreground')}>
                    End Time
                  </FormLabel>
                  <FormControl>
                    <TimeOnlyInput
                      value={field.value}
                      onValueChange={field.onChange}
                      thresholdTime={getThresholdTime(startTime)}
                      placeholder="Enter end time (e.g. 5:00 PM)"
                      disabled={!startTime}
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
