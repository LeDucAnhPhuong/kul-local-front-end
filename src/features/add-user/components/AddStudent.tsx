import TitlePage from '@/components/ui/title-page';
import MyForm from '@/components/ui/add-account-form';
import { StudentSampleData } from '@/features/account-management/data.student';

const AddStudent = () => {
  function onAddStudent(data: { email: string }) {
    StudentSampleData.push({
      id: StudentSampleData.length + 1,
      email: data.email,
      name: 'new student',
      isActive: true,
      createdAt: new Date().toISOString(),
      createdBy: 'admin',
      updatedAt: new Date().toISOString(),
      updatedBy: 'admin',
      role: 'student',
    });
  }

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage title="Add Student" />
      <MyForm onAdd={onAddStudent} />
    </div>
  );
};

export default AddStudent;
