import TitlePage from '@/components/ui/title-page';
import { toast } from 'sonner';
import MyForm from './update-class-form';
import { useUpdateClassMutation } from '../api.class';
import { useNavigate, useParams } from 'react-router';

const UpdateClass = () => {
  const [updateClass] = useUpdateClassMutation();
  const navigate = useNavigate();
  const { id } = useParams();

  async function onUpdateClass(data: { name: string; start_time: string; end_time: string }) {
    const idToast = toast.loading('Updating class...');
    try {
      const startTimeDate = new Date(data.start_time);
      const endTimeDate = new Date(data.end_time);
      console.log(data);
      await updateClass({
        id,
        name: data.name,
        start_time: startTimeDate,
        end_time: endTimeDate,
      }).unwrap();
      toast.success('Class updated successfully', {
        id: idToast,
      });
      navigate('/class-management');
    } catch (error) {
      toast.error('Failed to update class', {
        id: idToast,
      });
    }
  }

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage title="Update Class" />
      <MyForm onUpdate={onUpdateClass} />
    </div>
  );
};

export default UpdateClass;
