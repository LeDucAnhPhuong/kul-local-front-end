import TitlePage from '@/components/ui/title-page';
import { toast } from 'sonner';
import MyForm from './add-class-form';
const AddClass = () => {
//   const [addAdmin] = useCreateAdminMutation();

  async function onAddClass(data: { name: string }) {
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
      <TitlePage title="Add Class" />
      <MyForm onAdd={onAddClass} />
    </div>
  );
};

export default AddClass;
