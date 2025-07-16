import { baseApi } from '@/redux/baseApi';
export const teacherApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getQuizByCoach: builder.query({
      query: () => ({
        url: '/api/Quiz/coach',
        method: 'GET',
      }),
      providesTags: ['make-quiz'],
    }),
    getQuizByStudent: builder.query({
      query: () => ({
        url: '/api/Quiz/student',
        method: 'GET',
      }),
      providesTags: ['do-quiz'],
    }),
    createQuiz: builder.mutation({
      query: (data) => ({
        url: `/api/Quiz/create`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['make-quiz'],
    }),
    getQuizById: builder.query({
      query: ({ id }) => ({
        url: `/api/Quiz/${id}`,
        method: 'GET',
      }),
      providesTags: ['make-quiz'],
    }),
    updateQuiz: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/Quiz/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['make-quiz'],
    }),
    deleteQuiz: builder.mutation({
      query: (id) => ({
        url: `/api/Quiz/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['make-quiz'],
    }),
  }),
});
export const {
  useGetQuizByCoachQuery,
  useGetQuizByStudentQuery,
  useCreateQuizMutation,
  useGetQuizByIdQuery,
  useUpdateQuizMutation,
  useDeleteQuizMutation,
} = teacherApi;
