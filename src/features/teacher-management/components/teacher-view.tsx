import DataTable from '@/components/data-table/data-table';
import TitlePage from '@/components/ui/title-page';
import { exampleScheduelData } from '../data.teacher-ui';
import { convertToSlotByDay } from '../columns/convertToSlotByDay';
import { columns as desktopColumns } from '../columns/schedule.columns';
import { columns as mobileColumns } from '../columns/schedule.columnsmobile';
import DataCard from '@/components/ui/data-card';

function TeacherView() {
  return (
    <>
      <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
        <TitlePage title="Schedule"  />
        <div className="lg:hidden block">
          <DataCard data={convertToSlotByDay(exampleScheduelData)} columns={mobileColumns} />
        </div>
        <div className="hidden lg:block">
          <DataTable data={exampleScheduelData} columns={desktopColumns} />
        </div>
      </div>
    </>
  );
}

export default TeacherView;
