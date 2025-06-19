import TitlePage from '@/components/ui/title-page';
import MyForm from './add-schedule-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MyFormAuto from './add--schedule-form-auto';
import { toast } from 'sonner';
import { useCreateScheduleMutation, useCreateScheduleAutoMutation } from '../api.schedule';

const AddSchedule = () => {
  const [createSchedule] = useCreateScheduleMutation();
  const [createScheduleAuto] = useCreateScheduleAutoMutation();

  async function onAddSchedule(data: {
    classDate: Date;
    roomId: string;
    slotIds: string;
    classId: string;
    coachEmail: string;
  }) {
    const idToast = toast.loading('Creating schedule...');
    try {
      await createSchedule({
        date: data.classDate.toISOString(),
        roomId: data.roomId,
        slotIds: data.slotIds,
        classId: data.classId,
        coachEmail: data.coachEmail,
      }).unwrap();
      toast.success('Schedule created successfully', {
        id: idToast,
      });
    } catch (error) {
      toast.error('Failed to create schedule', {
        id: idToast,
      });
    }
  }

  async function onAddScheduleAuto(data: { dayOfWeek: string[]; classId: string[] }) {
    const idToast = toast.loading('Creating schedule...');
    try {
      await createScheduleAuto({
        dayOfWeek: data.dayOfWeek,
        classId: data.classId,
      }).unwrap();
      toast.success('Schedule created successfully', {
        id: idToast,
      });
    } catch (error) {
      toast.error('Failed to create schedule', {
        id: idToast,
      });
    }
  }

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <Tabs defaultValue="Add Schedule Manually" className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="Add Schedule Manually">Add Schedule Manually</TabsTrigger>
          <TabsTrigger value="Add Schedule Automatically">Add Schedule Automatically</TabsTrigger>
        </TabsList>
        <TabsContent value="Add Schedule Manually">
          <TitlePage title="Add Schedule Manually" />
          <MyForm onAdd={onAddSchedule} />
        </TabsContent>
        <TabsContent value="Add Schedule Automatically">
          <TitlePage title="Add Schedule Automatically" />
          <MyFormAuto onAdd={onAddScheduleAuto} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AddSchedule;
