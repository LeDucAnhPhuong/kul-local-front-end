import DataTable from '@/components/data-table/data-table';
import TitlePage from '@/components/ui/title-page';
import { exampleScheduelData, exampleUiSampleData } from '../data.example-ui';
import { columns } from '../columns/example-UI';
import { columns as columnsSchedule } from '../columns/schedule.comlumns';
import DataCard from '@/components/ui/data-card';

const ExampleUI = () => {
  const handleRowClick = (row: any) => {
    console.log('Row clicked:', row);
  };

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage title="example" href="/student-management" contentHref="Student Management" />
      <DataTable data={exampleUiSampleData} columns={columns} onRowClick={handleRowClick} />
      <div className="md:block hidden">
        <DataTable data={exampleScheduelData} columns={columnsSchedule} />
      </div>
      <div className="md:hidden block">
        <DataCard data={exampleScheduelData} columns={columnsSchedule} />
      </div>

      <DataCard data={exampleUiSampleData} columns={columns} />
    </div>
  );
};

export default ExampleUI;
