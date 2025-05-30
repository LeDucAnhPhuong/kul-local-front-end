import DataTable from '@/components/data-table/data-table';
import TitlePage from '@/components/ui/title-page';
import { columns } from '../columns/account-management';
import { useGetAdminQuery } from '../api.user';
import type { StudentData } from '../data.student';

const AdminManagement = () => {
  const { admin } = useGetAdminQuery(undefined, {
    selectFromResult: ({ data }) => ({
      admin:
        data?.data?.map((item: StudentData) => ({
          ...item,
          name:
            item.first_name || item.last_name
              ? `${item.last_name ?? ''} ${item.first_name ?? ''}`
              : 'N/A',
        })) || [],
    }),
  });

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage
        title="Manage Students"
        href="/account-management/student/add"
        contentHref="Add Student"
      />
      <DataTable data={admin} columns={columns} />
    </div>
  );
};

export default AdminManagement;
