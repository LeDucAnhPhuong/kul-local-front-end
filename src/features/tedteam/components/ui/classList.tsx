import DataCard from '@/components/ui/data-card';
import { columns } from '../../columns/class-management';
import TitlePage from '@/components/ui/title-page';
import { useGetClassesQuery } from '../../api.tedteam';


const ClassListUI = () => {

  const { classes, isFetching } = useGetClassesQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => ({
      classes: data?.data || [],
      isFetching,
    }),
  });
console.log('🚀 ~ ClassListUI ~ classes:', classes);

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage title="Manage Classes" />
      <DataCard data={classes} columns={columns} isLoading={isFetching}/>
    </div>
  );
};

export default ClassListUI;
