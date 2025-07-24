import TitlePage from '@/components/ui/title-page';
import MyForm from './add-schedule-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useCreateScheduleMutation } from '../api.schedule';
import { useNavigate } from 'react-router';
import ScheduleCreatorCalendar from './add-ui-schedule';

const AddSchedule = () => {
  const [createSchedule] = useCreateScheduleMutation();
  const navigate = useNavigate();

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
      navigate('/schedule-management');
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
          <TabsTrigger value="Add Schedule Calendar">Add Schedule Calendar</TabsTrigger>
        </TabsList>
        <TabsContent value="Add Schedule Manually">
          <TitlePage title="Add Schedule Manually" />
          <MyForm onAdd={onAddSchedule} />
        </TabsContent>
        <TabsContent value="Add Schedule Calendar">
          <TitlePage title="Add Schedule Calendar" />
          <ScheduleCreatorCalendar />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AddSchedule;
