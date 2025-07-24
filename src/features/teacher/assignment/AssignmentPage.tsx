import DataCard from '@/components/ui/data-card';
import React from 'react';
import { assignmentColumns } from '../columns/assignment.columns';
import { AssignmentCreateModal } from './CreateAssignment';
import TitlePage from '@/components/ui/title-page';
import { Button } from '@/components/ui/button';
import { useCreateAssignmentMutation, useGetTeacherAssignmentsQuery } from '../api.teacher';
import useRouter from '@/hooks/use-router';
import type { Assignment } from '../types/assignment';

const AssignmentPage = () => {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const [createAssignment, { isLoading: isAssignmentLoading }] = useCreateAssignmentMutation();
  const { assignments, isAssignmentsLoading } = useGetTeacherAssignmentsQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => ({
      assignments: data?.data || [],
      isAssignmentsLoading: isFetching,
    }),
  });

  const handleSubmit = async (data: any) => {
    try {
      await createAssignment(data).unwrap();
      setOpen(false);
    } catch {}
  };

  const handleView = (assignment: Assignment) => {
    router.push(`/assignment-submission/${assignment.id}`);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <TitlePage title="Assignments" />
        <Button onClick={() => setOpen(true)}>Add New Assignment</Button>
      </div>
      <AssignmentCreateModal
        loading={isAssignmentLoading}
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
      />
      <DataCard
        onRowClick={(row) => handleView(row.data)}
        columns={assignmentColumns}
        data={assignments}
        isLoading={isAssignmentsLoading}
      />
    </div>
  );
};

export default AssignmentPage;
