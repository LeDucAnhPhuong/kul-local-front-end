import TitlePage from '@/components/ui/title-page';
import { toast } from 'sonner';
import MyForm from './add-class-form';
import { useCreateClassMutation } from '../api.class';
const AddClass = () => {
  const [createClass] = useCreateClassMutation();

  async function onAddClass(data: { name: string; start_time: Date; end_time: Date }) {
    const idToast = toast.loading('Creating class...');
    try {
      await createClass({
        name: data.name,
        start_time: data.start_time.toISOString(),
        end_time: data.end_time.toISOString(),
      }).unwrap();
      toast.success('Class created successfully', {
        id: idToast,
      });
    } catch (error) {
      toast.error('Failed to create class', {
        id: idToast,
      });
    }
  }

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage title="Add Class" />
      <MyForm onAdd={onAddClass} />
    </div>
  );
};

export default AddClass;
