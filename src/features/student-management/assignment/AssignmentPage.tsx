import DataCard  from '@/components/ui/data-card';
import TitlePage  from '@/components/ui/title-page';
import useRouter  from '@/hooks/use-router';
import { useGetAssignmentStudentQuery }  from '../api.student';
import type { Assignment }  from '@/features/teacher/types/assignment';
import { assignmentStudentColumns }  from '../columns/assignment.columns';

const AssignmentStudentPage  = () => {
const router = useRouter();

// RTK Query hook để fetch assignments cho student
const { assignments, isAssignmentsLoading }  = useGetAssignmentStudentQuery(undefined, {
  selectFromResult: ({ data, isFetching }) => ({
    assignments: data?.data || [], // Extract nested data, fallback to empty array
    isAssignmentsLoading: isFetching, // Rename isFetching thành isAssignmentsLoading
  }),
});

// Handler để navigate đến chi tiết assignment
const handleView = (assignment: Assignment) => {
  router.push(`/assignments/${assignment.id}`);
};

return (
  <div className="p-4 bg-white rounded-lg shadow-md">
    <div className="flex items-center justify-between mb-4">
      <TitlePage title="Assignments" />
    </div>

    <DataCard
      onRowClick={(row) => handleView(row.data)} // Click vào row sẽ navigate đến detail page
      columns={assignmentStudentColumns} // Column definitions từ file riêng
      data={assignments}
      isLoading={isAssignmentsLoading}
    />
  </div>
);
};

export  default AssignmentStudentPage;