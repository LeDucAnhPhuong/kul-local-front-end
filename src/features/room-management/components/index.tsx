import DataTable from '@/components/data-table/data-table';
import TitlePage from '@/components/ui/title-page';
import { columns } from '../columns/room-management';
import { useGetRoomsQuery } from '../api.room';

const RoomManagement = () => {
  const { rooms, isFetching } = useGetRoomsQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => ({
      rooms: data?.data?.map((room: any) => ({
       ...room,
       myLocation: room.location || 'Unknown',
      })) || [],
      isFetching,
    }),
  });
  console.log('Rooms:', rooms);

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage title="Manage Rooms" contentHref="Add Room" href="/room-management/add" />
      <DataTable data={rooms} columns={columns} isLoading={isFetching}/>
    </div>
  );
};

export default RoomManagement;
