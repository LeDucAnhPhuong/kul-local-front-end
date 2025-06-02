import DataTable from '@/components/data-table/data-table';
import TitlePage from '@/components/ui/title-page';
import { mockSubmissions } from '../../data.assign';
import { columns as desktopColumns } from '../../columns/assignmentSubmissions.columns';
import DataCard from '@/components/ui/data-card';

function TeacherView() {
  return (
    <>
      <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
        <TitlePage title="Schedule"  />
        <div className="lg:hidden block">
          <DataCard data={mockSubmissions} columns={desktopColumns} />
        </div>
        <div className="hidden lg:block">
          <DataTable data={mockSubmissions} columns={desktopColumns} />
        </div>
      </div>
    </>
  );
}

export default TeacherView;
