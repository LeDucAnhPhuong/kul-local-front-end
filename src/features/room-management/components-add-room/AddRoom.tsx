import TitlePage from '@/components/ui/title-page';
import { toast } from 'sonner';
import MyForm from './add-room-form';
import { useCreateRoomMutation } from '../api.room';
import { useNavigate } from 'react-router';
const AddRoom = () => {
  const [createRoom] = useCreateRoomMutation();
  const navigate = useNavigate();

  async function onAddRoom(data: {
    name: string;
    description?: string;
    location: string;
    capacity: number;
  }) {
    const idToast = toast.loading('Creating room...');
    try {
      await createRoom({
        name: data.name,
        description: data.description,
        location: data.location,
        capacity: data.capacity,
      }).unwrap();
      toast.success('Room created successfully', {
        id: idToast,
      });
      navigate('/room-management');
    } catch (error) {
      toast.error('Failed to create room', {
        id: idToast,
      });
    }
  }
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage title="Add Room" />
      <MyForm onAdd={onAddRoom} />
    </div>
  );
};

export default AddRoom;
