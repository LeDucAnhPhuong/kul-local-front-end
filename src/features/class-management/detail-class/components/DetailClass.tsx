import DataTable from '@/components/data-table/data-table';
import TitlePage from '@/components/ui/title-page';
import { useParams } from 'react-router-dom';
import { columns } from '../columns/student-list';
import { useGetClassDetailQuery, useGetClassInfoQuery } from '../../api.class';
import type { StudentData } from '@/features/account-management/data.student';

const DetailClass = () => {
  const { id } = useParams();

  const { detailClass, isFetching } = useGetClassDetailQuery(id, {
    selectFromResult: ({ data, isFetching }) => ({
      detailClass:
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

  const { classInfo } = useGetClassInfoQuery(id, {
    selectFromResult: ({ data, isFetching }) => ({
      classInfo: data?.data || {},
      isFetching_class: isFetching,
    }),
  });

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage
        title={`Class ${classInfo.name}`}
        contentHref="Add Student"
        href={`/class-management/${id}/add-student`}
      />
      <DataTable data={detailClass} columns={columns} isLoading={isFetching} />
    </div>
  );
};

export default DetailClass;
