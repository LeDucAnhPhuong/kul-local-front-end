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
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useGetClassesQuery } from '@/features/class-management/api.class';
import { useGetRoomsQuery } from '../api.room';
import type { Slot } from '../data.type';
import { useGetAllSlotQuery } from '@/features/tedteam/api.tedteam';

const formSchema = z.object({
  classDate: z.date(),
  roomId: z.string(),
  slotIds: z.string(),
  classId: z.string(),
  coachEmail: z.string(),
});

interface MyFormProps {
  onAdd: (data: z.infer<typeof formSchema>) => void;
  isLoading?: boolean;
}

export default function MyForm({ onAdd }: MyFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      classDate: new Date(),
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

  const { roomList, isFetching_rooms } = useGetRoomsQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => ({
      roomList: data?.data || [],
      isFetching_rooms: isFetching,
    }),
  });

  const { slotList, isFetching_slots } = useGetAllSlotQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => ({
      slotList: data?.data
        ? (Array.from(data?.data) as Slot[])?.sort((a: Slot, b: Slot) => {
            const toMinutes = (time: string) => {
              const [h, m] = time.split(':').map(Number);
              return h * 60 + m;
            };
            return toMinutes(a.startTime) - toMinutes(b.startTime);
          })
        : [],
      isFetching_slots: isFetching,
    }),
  });

  const { classList, isFetching_classes } = useGetClassesQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => ({
      classList: data?.data || [],
      isFetching_classes: isFetching,
    }),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="classDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Class Date</FormLabel>
                  <Popover>
                    <PopoverTrigger>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          type="button"
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
              name="roomId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Name</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a room name ..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isFetching_rooms ? (
                        <div className="p-2 text-gray-400">Loading rooms...</div>
                      ) : roomList.length === 0 ? (
                        <div className="p-2 text-gray-400">No rooms found</div>
                      ) : (
                        roomList.map((room: any) => (
                          <SelectItem key={room.id} value={room.id}>
                            {room.name} - {room.location}
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
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="slotIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slot Name</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a slot name ..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isFetching_slots ? (
                        <div className="p-2 text-gray-400">Loading slots...</div>
                      ) : slotList.length === 0 ? (
                        <div className="p-2 text-gray-400">No slots found</div>
                      ) : (
                        slotList.map((slot: any) => (
                          <SelectItem key={slot.id} value={slot.id}>
                            {slot.name} ({slot.startTime} - {slot.endTime})
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

          <div className="col-span-6">
            <FormField
              control={form.control}
              name="classId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Name</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        </div>

        <FormField
          control={form.control}
          name="coachEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coach Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter email of coach ..." type="email" {...field} />
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
