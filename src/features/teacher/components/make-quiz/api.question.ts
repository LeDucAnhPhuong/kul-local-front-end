import { baseApi } from '@/redux/baseApi';
export const teacherApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getQuestionByQuizId: builder.query({
      query: ({ id }) => ({
        url: `/api/Question/quiz/${id}`,
        method: 'GET',
      }),
      providesTags: ['make-question'],
    }),
    createQuestion: builder.mutation({
      query: (data) => ({
        url: `/api/Question/create`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['make-question'],
    }),
    updateQuestion: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/Question/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['make-question'],
    }),
    deleteQuestion: builder.mutation({
      query: (id) => ({
        url: `/api/Question/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['make-question'],
    }),
    exportQuestions: builder.mutation({
      query: (quizId) => ({
        url: `/api/Question/export/${quizId}`,
        method: 'GET',
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});
export const {
  useGetQuestionByQuizIdQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  useExportQuestionsMutation,
} = teacherApi;
