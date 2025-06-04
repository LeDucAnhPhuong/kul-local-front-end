
import DataCard from '@/components/ui/data-card';
import { ClassSampleData } from '../data.class';
import { columns } from '../columns/class-management';
import TitlePage from '@/components/ui/title-page';

const ClassListUI = () => {
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage
        title="Manage Classes"
        href="/class-management/add"
        contentHref="Add Class"
      />
      <DataCard data={ClassSampleData} columns={columns} />
    </div>
  );
};

export default ClassListUI;
