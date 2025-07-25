import DataTable from '@/components/data-table/data-table';
import TitlePage from '@/components/ui/title-page';
import { columns } from '../columns/account-management';
import { useGetAdminQuery } from '../api.user';
import type { StudentData } from '../data.student';

const AdminManagement = () => {
  const { admin, isFetching } = useGetAdminQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => ({
      admin:
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
        title="Manage Admin"
        href="/account-management/admin/add"
        contentHref="Add Admin"
      />
      <DataTable data={admin} columns={columns} isLoading={isFetching} />
    </div>
  );
};

export default AdminManagement;
