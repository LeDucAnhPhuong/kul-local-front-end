import TitlePage from '@/components/ui/title-page';
import MyForm from '@/components/ui/add-account-form';
import { AdminSampleData } from '@/features/account-management/data.admin';
const AddAdmin = () => {
  function onAddAdmin(data: { email: string }) {
    AdminSampleData.push({
      id: AdminSampleData.length + 1,
      email: data.email,
      name: 'new admin',
      isActive: true,
      createdAt: new Date().toISOString(),
      createdBy: 'admin',
      updatedAt: new Date().toISOString(),
      updatedBy: 'admin',
      role: 'admin',
    });
  }
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage title="Add Admin" />
      <MyForm onAdd={onAddAdmin} />
    </div>
  );
};

export default AddAdmin;
