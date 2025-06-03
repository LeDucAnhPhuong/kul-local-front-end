'use client';
import TitlePage from '@/components/ui/title-page';
import MyForm from '@/features/add-user/components/add-account-form';
import { useCreateAdminMutation } from '@/features/account-management/api.user';
import { toast } from 'sonner';
const AddAdmin = () => {
  const [addAdmin] = useCreateAdminMutation();

  async function onAddAdmin(data: { email: string }) {
    const idToast = toast.loading('Adding admin...');
    try {
      await addAdmin({
        email: data.email,
      }).unwrap();
      toast.success('Admin added successfully', {
        id: idToast,
      });
    } catch (error) {
      toast.error('Failed to add admin', {
        id: idToast,
      });
    }
  }
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage title="Add Admin" />
      <MyForm onAdd={onAddAdmin} />
    </div>
  );
};

export default AddAdmin;
