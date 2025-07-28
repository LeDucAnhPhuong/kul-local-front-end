import DataTable from '@/components/data-table/data-table';
import TitlePage from '@/components/ui/title-page';
import { columns } from '../columns/account-management';
import { useGetTedTeamQuery } from '../api.user';
import type { StudentData } from '../data.student';

const TedTeamManagement = () => {
  const { tedTeam, isFetching } = useGetTedTeamQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => ({
      tedTeam:
        data?.data?.map((item: StudentData) => ({
          ...item,
          name:
            item.firstName || item.lastName
              ? `${item.lastName ?? ''} ${item.firstName ?? ''}`
              : 'N/A',
        })) || [],
      isFetching,
    }),
  });

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage
        title="Manage TedTeam"
        href="/account-management/ted-team/add"
        contentHref="Add TedTeam"
      />
      <DataTable data={tedTeam} columns={columns} isLoading={isFetching} />
    </div>
  );
};

export default TedTeamManagement;
