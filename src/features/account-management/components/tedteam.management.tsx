import DataTable from '@/components/data-table/data-table';
import TitlePage from '@/components/ui/title-page';
import { columns } from '../columns/account-management';
import { useGetTedTeamQuery } from '../api.user';
import type { StudentData } from '../data.student';

const TedTeamManagement = () => {
  const { tedTeam } = useGetTedTeamQuery(undefined, {
    selectFromResult: ({ data }) => ({
      tedTeam:
        data?.data?.map((item: StudentData) => ({
          ...item,
          name:
            item.first_name || item.last_name
              ? `${item.first_name ?? ''} ${item.last_name ?? ''}`
              : 'N/A',
        })) || [],
    }),
  });

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage
        title="Manage TedTeam"
        href="/account-management/ted-team/add"
        contentHref="Add TedTeam"
      />
      <DataTable data={tedTeam} columns={columns} />
    </div>
  );
};

export default TedTeamManagement;
