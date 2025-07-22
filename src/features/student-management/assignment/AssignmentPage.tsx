import DataCard from '@/components/ui/data-card';
import TitlePage from '@/components/ui/title-page';
import useRouter from '@/hooks/use-router';
import { useGetAssignmentStudentQuery } from '../api.student';
import type { Assignment } from '@/features/teacher/types/assignment';
import { assignmentStudentColumns } from '../columns/assignment.columns';

const AssignmentStudentPage = () => {
  const router = useRouter();
  const { assignments, isAssignmentsLoading } = useGetAssignmentStudentQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => ({
      assignments: data?.data || [],
      isAssignmentsLoading: isFetching,
    }),
  });

  const handleView = (assignment: Assignment) => {
    router.push(`/assignments/${assignment.id}`);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <TitlePage title="Assignments" />
      </div>

      <DataCard
        onRowClick={(row) => handleView(row.data)}
        columns={assignmentStudentColumns}
        data={assignments}
        isLoading={isAssignmentsLoading}
      />
    </div>
  );
};

export default AssignmentStudentPage;
