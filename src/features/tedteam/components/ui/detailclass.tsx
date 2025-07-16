import DataTable from '@/components/data-table/data-table';
import TitlePage from '@/components/ui/title-page';
import { useParams } from 'react-router-dom';
import { columns } from '../../columns/detailclass-columns';
import { useGetClassDetailQuery, useUpdateAttendanceStatusMutation, useGetTedTeamScheduleByDateRangeQuery } from '../../api.tedteam';
import { useState } from 'react';
import { Button } from 'react-day-picker';
import { toast } from 'sonner';

const DetailClass = () => {
  const { id } = useParams();
  const [attendanceList, setAttendanceList] = useState<{ user_id: string; status: number }[]>([]);
  const [updateAttendance] = useUpdateAttendanceStatusMutation();

  const { classDetail, members, isFetching } = useGetClassDetailQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => {
      const found = data?.data.find(
        (item: { class: { id: string | undefined } }) => item.class.id === id,
      );
      return {
        classDetail: found?.class,
        members: found?.members || [],
        isFetching,
      };
    },
  });

  console.log('as', members);
  const today = new Date(classDetail?.startTime || new Date());
  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  const startDate = formatDate(today);
  const endDate = startDate;
  const { data: scheduleData, isLoading } = useGetTedTeamScheduleByDateRangeQuery({
    startDate,
    endDate,
  });
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage title="Manage Classes" />
      <div className="flex justify-end mb-4">
        <Button
          disabled={attendanceList.length === 0}
          onClick={async () => {
            try {
              await Promise.all(
                attendanceList.map(({ user_id, status }) =>
                  updateAttendance({ user_id, status })
                )
              );
              toast.success("Successfull!");
            } catch (err) {
              toast.error("Error");
            }
          }}
        >
          Save Attendance
        </Button>
      </div>
      <DataTable data={members}
        columns={columns(scheduleData, setAttendanceList)}
        isLoading={isFetching || isLoading} />
    </div>
  );
};

export default DetailClass;
