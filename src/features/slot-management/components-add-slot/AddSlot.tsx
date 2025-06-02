import TitlePage from '@/components/ui/title-page';
import { toast } from 'sonner';
import MyForm from './add-slot-form';
const AddSlot = () => {
//   const [addAdmin] = useCreateAdminMutation();

  async function onAddSlot(data: { name: string, description?: string, start_time: Date, end_time: Date }) {
    // const idToast = toast.loading('Adding admin...');
    // try {
    //   await addAdmin({
    //     email: data.email,
    //   }).unwrap;
    //   toast.success('Admin added successfully', {
    //     id: idToast,
    //   });
    // } catch (error) {
    //   toast.error('Failed to add admin', {
    //     id: idToast,
    //   });
    // }
  }
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage title="Add Slot" />
      <MyForm onAdd={onAddSlot} />
    </div>
  );
};

export default AddSlot;
