'use client';
import TitlePage from '@/components/ui/title-page';
import MyForm from '@/features/account-management/add-user/components/add-account-form';
import { toast } from 'sonner';
import { useCreateCoachMutation } from '@/features/account-management/api.user';
import { useNavigate } from 'react-router';

const AddCoach = () => {
  const [addCoach] = useCreateCoachMutation();
  const navigate = useNavigate();

  async function onAddCoach(data: { email: string }) {
    const idToast = toast.loading('Adding coach...');
    try {
      await addCoach({
        email: data.email,
      }).unwrap();
      toast.success('coach added successfully', {
        id: idToast,
      });
      navigate('/account-management');
    } catch (error) {
      toast.error('Failed to add coach', {
        id: idToast,
      });
    }
  }

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage title="Add Coach" />
      <MyForm onAdd={onAddCoach} />
    </div>
  );
};

export default AddCoach;
