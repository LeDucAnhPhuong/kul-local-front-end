import DataTable from '@/components/data-table/data-table';
import TitlePage from '@/components/ui/title-page';
import { useParams } from 'react-router-dom';
import { columns } from '../columns/student-list';
import { StudentSampleData } from '../data.student';

const DetailClass = () => {
  const { name } = useParams();
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage
        title={`Detail ${name}`}
        contentHref="Add Student"
        href={`/class-management/${name}/add-student`}
      />
      <DataTable data={StudentSampleData} columns={columns} />
    </div>
  );
};

export default DetailClass;
