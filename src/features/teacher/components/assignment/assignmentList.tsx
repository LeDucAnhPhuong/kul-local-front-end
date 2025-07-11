import React from 'react';
import DataCard from '@/components/ui/data-card';
import TitlePage from '@/components/ui/title-page';
import { mockSubmissions } from '../../data.assign';
import { columns as desktopColumns } from '../../columns/assignmentSubmissions.columns';
import { useNavigate } from 'react-router-dom';

function AssignmentView() {
  const navigate = useNavigate();

  // Lấy danh sách unique assignment theo id và title
  const uniqueAssignments = Array.from(
    new Map(
      mockSubmissions.map((item) => [
        item.assignment.id,
        {
          id: item.assignment.id,
          title: item.assignment.title,
        },
      ])
    ).values()
  );

  return (
    <div>
      <TitlePage title="Assignments" />
      {uniqueAssignments.map((assignment) => {
        const submissionsForAssignment = mockSubmissions.filter(
          (item) => item.assignment.id === assignment.id
        );

        return (
          <div key={assignment.id} className="mb-8">
            <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
              <h2 className="text-lg font-semibold mb-4">
                Assignment: {assignment.title}
              </h2>
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
