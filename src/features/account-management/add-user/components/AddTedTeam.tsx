'use client';
import TitlePage from '@/components/ui/title-page';
import MyForm from '@/features/account-management/add-user/components/add-account-form';
import { toast } from 'sonner';
import { useCreateTedTeamMutation } from '@/features/account-management/api.user';

const AddTedTeam = () => {
  const [addTedTeam] = useCreateTedTeamMutation();

  async function onAddTedTeam(data: { email: string }) {
    const idToast = toast.loading('Adding student...');
    try {
      await addTedTeam({
        email: data.email,
      }).unwrap();
      toast.success('student added successfully', {
        id: idToast,
      });
    } catch (error) {
      toast.error('Failed to add student', {
        id: idToast,
      });
    }
  }

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage title="Add Ted" />
      <MyForm onAdd={onAddTedTeam} />
    </div>
  );
};

export default AddTedTeam;
