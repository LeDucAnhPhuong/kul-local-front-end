import { baseApi } from '@/redux/baseApi';

export const studentScheduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
   
       getAssignmentSubmissionByAssignmentId: builder.query({
      query: (assignmentId) => ({
        url: `/api/assignment-submissions/assignment/${assignmentId}`,
        method: 'GET',
      }),
      providesTags: ['assignmentSubmission'],
    }),
    
    getAcademicProgress: builder.query({
      query: () => ({
        url: '/api/Academic/progress',
        method: 'GET',
      }),
    }),
    getAssignmentById: builder.query({
      query: (id) => ({
        url: `/api/assignments/${id}`,
        method: 'GET',
      }),
      providesTags: ['assignment'],
    }),
    resubmitAssignment: builder.mutation({
      query: ({ submissionId, data }) => ({
        url: `/api/assignment-submissions/${submissionId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['assignmentSubmission'],
    }),
  
    
    getScheduleByWeek: builder.query({
      query: ({ startDate, endDate }) => ({
        url: `/api/Attendance/get-personal`,
        method: 'GET',
        params: { startDate, endDate },
      }),
    }),
      
       getAssignmentStudent: builder.query({
      query: () => ({
        url: '/api/assignments/get-for-student',
        method: 'GET',
      }),
      providesTags: ['assignment'],
    }),
     submitAssignment: builder.mutation({
      query: (data) => ({
        url: `/api/assignment-submissions`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['assignmentSubmission'],
    }),
      
  }),
  
});


export const {
  useGetScheduleByWeekQuery,
  useGetAssignmentStudentQuery,
  useGetAssignmentByIdQuery,
  useGetAssignmentSubmissionByAssignmentIdQuery,
  useSubmitAssignmentMutation,
  useResubmitAssignmentMutation,
  useGetAcademicProgressQuery,
} = studentScheduleApi;
