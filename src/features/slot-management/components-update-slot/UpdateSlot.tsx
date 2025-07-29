import TitlePage from '@/components/ui/title-page';
import { toast } from 'sonner';
import MyForm from './update-slot-form';
import { useNavigate, useParams } from 'react-router';
import { useUpdateSlotMutation } from '../api.slot';
const UpdateSlot = () => {
  const [updateSlot] = useUpdateSlotMutation();
  const navigate = useNavigate();

  const { id } = useParams();

  async function onUpdateSlot(data: {name: string; startTime: Date; endTime: Date }) {
    const idToast = toast.loading('Updating slot...');
    try {
      await updateSlot({
        id: id,
        name: data.name,
        startTime: data.startTime.toISOString(),
        endTime: data.endTime.toISOString(),
      }).unwrap();
      toast.success('Slot updated successfully', {
        id: idToast,
      });
      navigate('/slot-management');
    } catch (error) {
      toast.error('Failed to update slot', {
        id: idToast,
      });
    }
  }
  
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage title="Update Slot" />
      <MyForm onUpdate={onUpdateSlot} />
    </div>
  );
};

export default UpdateSlot;
