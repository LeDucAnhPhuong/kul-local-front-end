import TitlePage from '@/components/ui/title-page';
import MyForm from '@/components/ui/add-account-form';
import { CoachSampleData } from '@/features/account-management/data.coach';

const AddCoach = () => {
  function onAddCoach(data: { email: string }) {
    CoachSampleData.push({
      id: CoachSampleData.length + 1,
      email: data.email,
      name: 'new coach',
      isActive: true,
      createdAt: new Date().toISOString(),
      createdBy: 'admin',
      updatedAt: new Date().toISOString(),
      updatedBy: 'admin',
      role: 'coach',
    });
  }
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage title="Add Coach" />
      <MyForm onAdd={onAddCoach} />
    </div>
  );
};

export default AddCoach;
