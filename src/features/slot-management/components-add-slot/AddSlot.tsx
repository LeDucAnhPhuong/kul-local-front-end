import TitlePage from '@/components/ui/title-page';
import { toast } from 'sonner';
import MyForm from './add-slot-form';
import { useCreateSlotMutation } from '../api.slot';
const AddSlot = () => {
  const [createSlot] = useCreateSlotMutation();

  async function onAddSlot(data: { name: string, startTime: Date, endTime: Date }) {
    const idToast = toast.loading('Creating slot...');
    try {
      await createSlot({
        name: data.name,
        startTime: data.startTime.toISOString(),
        endTime: data.endTime.toISOString(),
      }).unwrap();
      toast.success('Slot created successfully', {
        id: idToast,
      });
    } catch (error) {
      toast.error('Failed to create slot', {
        id: idToast,
      });
    }
  }
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage title="Add Slot" />
      <MyForm onAdd={onAddSlot} />
    </div>
  );
};

export default AddSlot;
