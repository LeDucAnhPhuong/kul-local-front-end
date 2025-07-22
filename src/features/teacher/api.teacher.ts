import { baseApi } from '@/redux/baseApi';
export const teacherApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTeacherSchedule: builder.query({
      query: ({ startDate, endDate }) => ({
        url: '/api/Schedule/schedules/personal/date-range',
        method: 'GET',
        params: { startDate, endDate },
      }),
    }),
    getNewsForTeacher: builder.query({
      query: () => ({
        url: '/api/news/coach',
        method: 'GET',
      }),
    }),
    getSlotById: builder.query({
      query: (id: string) => ({
        url: `/api/Slot/slots/${id}`,
        method: 'GET',
      }),
    }),
    getSlots: builder.query({
      query: () => `/api/Slot/slots`,
    }),
    getNewsById: builder.query({
      query: (id: string) => ({
        url: `/api/News/${id}`,
        method: 'GET',
      }),
    }),
    gradeNews: builder.mutation({
      query: (data) => ({
        url: `/api/NewsResult`,
        method: 'POST',
        body: data,
      }),
    }),
    createAssignment: builder.mutation({
      query: (assignment) => ({
        url: '/api/assignments',
        method: 'POST',
        body: assignment,
      }),
      invalidatesTags: ['assignment'],
    }),
    getTeacherAssignments: builder.query({
      query: () => ({
        url: '/api/assignments/get-for-coach',
        method: 'GET',
      }),
      providesTags: ['assignment'],
    }),
    getSubmissionByAssignmentForCoach: builder.query({
      query: (assignmentId) => ({
        url: `/api/assignment-submissions/coach/${assignmentId}`,
        method: 'GET',
      }),
      providesTags: ['assignmentSubmission'],
    }),
    gradeSubmission: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/assignment-submissions/${id}/grade`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['assignmentSubmission'],
    }),
  }),
});
export const {
  useGetTeacherScheduleQuery,
  useGetSlotByIdQuery,
  useGetSlotsQuery,
  useGetNewsForTeacherQuery,
  useGetNewsByIdQuery,
  useGradeNewsMutation,
  useCreateAssignmentMutation,
  useGetTeacherAssignmentsQuery,
  useGetSubmissionByAssignmentForCoachQuery,
  useGradeSubmissionMutation,
} = teacherApi;
