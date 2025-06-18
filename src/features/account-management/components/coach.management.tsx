import DataTable from '@/components/data-table/data-table';
import TitlePage from '@/components/ui/title-page';
import { columns } from '../columns/account-management';
import { useGetCoachesQuery } from '../api.user';
import type { TedTeamData } from '../data.tedTeam';

const CoachManagement = () => {
  const { coaches, isFetching } = useGetCoachesQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => ({
      coaches:
        data?.data?.map((item: TedTeamData) => ({
          ...item,
          name:
            item.first_name || item.last_name
              ? `${item.last_name ?? ''} ${item.first_name ?? ''}`
              : 'N/A',
        })) || [],
      isFetching,
    }),
  });
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage
        title="Manage Coach"
        href="/account-management/coach/add"
        contentHref="Add Coach"
      />
      <DataTable data={coaches} columns={columns} isLoading={isFetching} />
    </div>
  );
};

export default CoachManagement;
