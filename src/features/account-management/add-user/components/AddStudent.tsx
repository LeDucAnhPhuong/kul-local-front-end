'use client';
import TitlePage from '@/components/ui/title-page';
import { useCreateStudentMutation } from '@/features/account-management/api.user';
import MyForm from '@/features/account-management/add-user/components/add-account-form';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

const AddStudent = () => {
  const [createStudent] = useCreateStudentMutation();
  const navigate = useNavigate();

  const onAddStudent = async (data: { email: string }) => {
    const idToast = toast.loading('Adding student...');
    try {
      await createStudent({
        email: data.email,
      }).unwrap();
      toast.success('student added successfully', {
        id: idToast,
      });
      navigate('/account-management');
    } catch (error) {
      toast.error('Failed to add student', {
        id: idToast,
      });
    }
  };

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage title="Add Student" />
      <MyForm onAdd={onAddStudent} />
    </div>
  );
};

export default AddStudent;
