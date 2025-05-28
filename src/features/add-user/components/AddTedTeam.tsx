import TitlePage from '@/components/ui/title-page';
import MyForm from '@/components/ui/add-account-form';
import { TedTeamSampleData } from '@/features/account-management/data.tedTeam';

const AddTedTeam = () => {
  function onAddTedTeam(data: { email: string }) {
    TedTeamSampleData.push({
      id: TedTeamSampleData.length + 1,
      email: data.email,
      name: 'new ted team member',
      isActive: true,
      createdAt: new Date().toISOString(),
      createdBy: 'admin',
      updatedAt: new Date().toISOString(),
      updatedBy: 'admin',
      role: 'tedTeam',
    });
  }

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage title="Add Ted" />
      <MyForm onAdd={onAddTedTeam} />
    </div>
  );
};

export default AddTedTeam;
