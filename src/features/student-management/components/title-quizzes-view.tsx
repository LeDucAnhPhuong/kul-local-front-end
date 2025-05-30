import DataTable from '@/components/data-table/data-table';
import TitlePage from '@/components/ui/title-page';
import { quizSampleData } from '../quizzesInfo';
import { columns } from '../columns/title-quizzes';

import DataCard from '@/components/ui/data-card';

const QuizzesUI = () => {
  const handleRowClick = (row: any) => {
    console.log('Row clicked:', row);
  };

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage title="List Quizzes Title"/>
      <DataCard data={quizSampleData} columns={columns} />
    </div>
  );
};

export default QuizzesUI;
