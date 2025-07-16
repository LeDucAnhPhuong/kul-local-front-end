import DataCard from '@/components/ui/data-card';
import TitlePage from '@/components/ui/title-page';
import { mockSubmissions } from '../../data.assign';
import { columns as desktopColumns } from '../../columns/assignmentSubmissions.columns';
import { useNavigate } from 'react-router-dom';
function AssignmentView() {
  const assignmentIds = Array.from(new Set(mockSubmissions.map((item) => item.assignmentId)));
  const navigate = useNavigate();
  return (
    <div>
      <TitlePage title="Assignments" />
      {assignmentIds.map((assignmentId) => {
        const submissionsForAssignment = mockSubmissions.filter(
          (item) => item.assignmentId === assignmentId,
        );
        return (
          <div key={assignmentId} className="mb-8">
            <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
              <h2 className="text-lg font-semibold mb-4">Assignment ID: {assignmentId}</h2>
              <DataCard
                data={submissionsForAssignment}
                columns={desktopColumns}
                onRowClick={({ data }) => navigate(`/submissions/${data.id}`)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default AssignmentView;
