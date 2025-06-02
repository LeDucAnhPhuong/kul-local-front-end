import DataTable from '@/components/data-table/data-table';
import TitlePage from '@/components/ui/title-page';
import { columns } from '../columns/slot-management';
import { SlotSampleData } from '../data.slot';

const SlotManagement = () => {
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage title="Manage Slots" contentHref="Add Slot" href="/slot-management/add" />
      <DataTable data={SlotSampleData} columns={columns} />
    </div>
  );
};

export default SlotManagement;
