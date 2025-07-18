import DataCard from '@/components/ui/data-card';
import { columns } from '../../columns/class-management';
import TitlePage from '@/components/ui/title-page';
import { useGetClassDetailQuery } from '../../api.tedteam';

const ClassListUI = () => {
  // const { cd, idsad } = useGetClassDetailQuery(undefined, {
  //   selectFromResult: ({ data, idsad }) => ({
  //     cd: data?.data || [],
  //     idsad,
  //   }),
  // });
  // console.log('asd',cd);
  // //
  const { classDetail, isFetching } = useGetClassDetailQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => ({
      classDetail:
        data?.data.map(
          (item: { class: { id: any; name: any; isActive: any; startTime: any } }) => ({
            id: item.class.id,
            name: item.class.name,
            isActive: item.class.isActive,
            startTime: item.class.startTime,
          }),
        ) || [],
      isFetching,
    }),
});
  console.log('classDetail:', classDetail);

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage title="Manage Classes" />
      <DataCard data={classDetail} columns={columns} isLoading={isFetching} />
    </div>
  );
};

export default ClassListUI;
