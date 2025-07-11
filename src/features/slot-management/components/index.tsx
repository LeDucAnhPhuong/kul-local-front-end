import DataTable from '@/components/data-table/data-table';
import TitlePage from '@/components/ui/title-page';
import { columns } from '../columns/slot-management';
import { useGetSlotsQuery } from '../api.slot';

const SlotManagement = () => {
  const { slots, isFetching } = useGetSlotsQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => ({
      slots: data?.data || [],
      isFetching,
    }),
  });

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage title="Manage Slots" contentHref="Add Slot" href="/slot-management/add" />
      <DataTable data={slots} columns={columns} isLoading={isFetching}/>
    </div>
  );
};

export default SlotManagement;
