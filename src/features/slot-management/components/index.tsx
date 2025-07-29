import DataTable from '@/components/data-table/data-table';
import TitlePage from '@/components/ui/title-page';
import { columns, type Slot } from '../columns/slot-management';
import { useGetAllSlotQuery } from '@/features/tedteam/api.tedteam';


const SlotManagement = () => {
  const { slots, isFetching } = useGetAllSlotQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => ({
      slots: data?.data
        ? (Array.from(data?.data) as Slot[])?.sort((a: Slot, b: Slot) => {
            const toMinutes = (time: string) => {
              const [h, m] = time.split(':').map(Number);
              return h * 60 + m;
            };
            return toMinutes(a.startTime) - toMinutes(b.startTime);
          })
        : [],
      isFetching,
    }),
  });

  

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage title="Manage Slots" contentHref="Add Slot" href="/slot-management/add" />
      <DataTable data={slots} columns={columns} isLoading={isFetching} />
    </div>
  );
};

export default SlotManagement;
