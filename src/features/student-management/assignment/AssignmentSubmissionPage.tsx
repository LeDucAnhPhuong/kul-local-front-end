import { AssignmentSubmissionCard }  from './AssignmentSubmissionCard';
import {
useGetAssignmentSubmissionByAssignmentIdQuery,
useResubmitAssignmentMutation,
useSubmitAssignmentMutation,
}  from '../api.student';
import { skipToken }  from '@reduxjs/toolkit/query';
import { useParams }  from 'react-router-dom';
import { useUploadFileMutation }  from '@/features/file/file.api';

const AssignmentSubmissionPage = () => {
const { id } = useParams<{ id: string }>();

const [submitAssignment] = useSubmitAssignmentMutation();
const [reSubmitAssignment] = useResubmitAssignmentMutation();
const [uploadFile] = useUploadFileMutation();

const { assignment, isFetching } = useGetAssignmentSubmissionByAssignmentIdQuery(
  id ?? skipToken,
  {
    selectFromResult: ({ data, isFetching }) => ({
      assignment: data?.data || {},
      isFetching,
    }),
  },
);
const handleUploadFile = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await uploadFile(formData).unwrap();
    return response.url;
  } catch (error) {
    console.error('File upload failed:', error);
    throw error;
  }
};

const handleSubmit = async (file: File) => {
  try {
    const fileData = await handleUploadFile(file);
    await submitAssignment({ assignmentId: id, content: fileData }).unwrap();
  } catch (error) {
    console.error('Submission failed:', error);
  }
};

const handleResubmit = async (file: File) => {
  if (!assignment.submissions) return;
  try {
    const fileData = await handleUploadFile(file);
    await reSubmitAssignment({
      submissionId: assignment?.submissions?.id,
      data: { content: fileData },
    }).unwrap();
  } catch (error) {
    console.error('Resubmission failed:', error);
  }
};

console.log('assignment :>> ', assignment);

return (
  <div className="p-4 bg-white rounded-lg shadow-md">
    <AssignmentSubmissionCard
      {...assignment}
      loading={isFetching}
      onResubmit={handleResubmit}
      onFirstSubmit={handleSubmit}
    />
  </div>
);
};

export  default AssignmentSubmissionPage;
