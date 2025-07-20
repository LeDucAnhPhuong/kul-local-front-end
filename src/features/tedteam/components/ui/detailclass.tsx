import DataTable from '@/components/data-table/data-table';
import TitlePage from '@/components/ui/title-page';
import { useParams, useSearchParams } from 'react-router-dom';
import { columns } from '../../columns/detailclass-columns';
import { useUpdateAttendanceStatusMutation } from '../../api.tedteam';
import { use, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { skipToken } from '@reduxjs/toolkit/query';
import { useGetClassDetailQuery } from '@/features/class-management/api.class';

const DetailClass = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const schedule = searchParams.get('schedule');

  const [attendanceList, setAttendanceList] = useState<{ user_id: string; status: number }[]>([]);
  const [updateAttendance] = useUpdateAttendanceStatusMutation();

  const { members, isFetching } = useGetClassDetailQuery(id || skipToken, {
    selectFromResult: ({ data, isFetching }) => {
      return {
        members: data?.data || [],
        isFetching,
      };
    },
  });

  useEffect(() => {
    if (members) {
      const initialAttendanceList = members.map((member: any) => ({
        user_id: member.id,
        status: member.status || 0,
      }));
      setAttendanceList(initialAttendanceList);
    }
  }, [members]);

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage title="Manage Classes" />
      <div className="flex justify-end mb-4">
        <Button
          disabled={attendanceList.length === 0}
          onClick={async () => {
            try {
              await updateAttendance({
                classId: id,
                students: attendanceList?.map((item) => ({
                  userId: item.user_id,
                  status: item.status === 0 ? 'Absent' : 'Present',
                })),
                scheduleId: schedule || '',
              }).unwrap();
              toast.success('Successfull!');
            } catch (err) {
              toast.error('Error');
            }
          }}
        >
          Save Attendance
        </Button>
      </div>
      <DataTable
        data={members}
        columns={columns(members, setAttendanceList, attendanceList)}
        isLoading={isFetching}
      />
    </div>
  );
};

export default DetailClass;
