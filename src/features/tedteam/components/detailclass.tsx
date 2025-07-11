import DataTable from '@/components/data-table/data-table';
import TitlePage from '@/components/ui/title-page';
import { useParams } from 'react-router-dom';
import { columns } from '../columns/class-management';
import { useGetClassDetailQuery, useGetClassInfoQuery } from '../api.tedteam';
import type { StudentData } from '@/features/account-management/data.student';

const DetailClass = () => {
  const { id } = useParams();

  const { detailClass, isFetching } = useGetClassDetailQuery(id, {
    selectFromResult: ({ data, isFetching }) => ({
      detailClass:
        data?.data?.map((item: StudentData) => ({
          ...item,
          name:
            item.first_name || item.last_name
              ? `${item.last_name ?? ''} ${item.first_name ?? ''}`
              : 'N/A',
        })) || [],
      isFetching,
    }),
  });

  const { classInfo, isFetching_class } = useGetClassInfoQuery(id, {
    selectFromResult: ({ data, isFetching }) => ({
      classInfo: data?.data || {},
      isFetching_class: isFetching,
    }),
  });

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage
        title={`Class ${classInfo.name}`}
      />
      <DataTable data={detailClass} columns={columns} isLoading={isFetching} />
    </div>
  );
};

export default DetailClass;
