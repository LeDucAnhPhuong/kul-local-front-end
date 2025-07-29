import TitlePage from '@/components/ui/title-page';
import { toast } from 'sonner';
import MyForm from './update-room-form';
import { useUpdateRoomMutation } from '../api.room';
import { useNavigate, useParams } from 'react-router';
const UpdateRoom = () => {
  const [updateRoom] = useUpdateRoomMutation();
  const navigate = useNavigate();
  const { id } = useParams();

  async function onUpdateRoom(data: {
    name: string;
    description?: string;
    location: string;
    capacity: number;
  }) {
    const idToast = toast.loading('Updating room...');
    try {
      await updateRoom({
        id,
        ...data,
      }).unwrap();
      toast.success('Room updated successfully', {
        id: idToast,
      });
      navigate('/room-management');
    } catch (error) {
      toast.error('Failed to update room', {
        id: idToast,
      });
    }
  }
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage title="Update Room" />
      <MyForm onUpdate={onUpdateRoom} />
    </div>
  );
};

export default UpdateRoom;
