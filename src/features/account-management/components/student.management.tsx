import DataTable from '@/components/data-table/data-table';
import TitlePage from '@/components/ui/title-page';
import { columns } from '../columns/account-management';
import { useGetStudentQuery } from '../api.user';
import type { StudentData } from '../data.student';

const StudentManagement = () => {
  const { students, isFetching } = useGetStudentQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => ({
      students:
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
        title="Manage Students"
        href="/account-management/student/add"
        contentHref="Add Student"
      />
      <DataTable data={students} columns={columns} isLoading={isFetching} />
    </div>
  );
};

export default StudentManagement;
