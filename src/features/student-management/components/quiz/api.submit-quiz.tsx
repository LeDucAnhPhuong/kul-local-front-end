import { baseApi } from '@/redux/baseApi';
export const teacherApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitQuiz: builder.mutation({
      query: (data) => ({
        url: `/api/QuizResult/submit`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['QuizResult'],
    }),
    getQuizResultByUser: builder.query({
      query: () => ({
        url: `/api/QuizResult/user`,
        method: 'Get',
      }),
      providesTags: ['QuizResult'],
    }),
    getQuizResultByQuiz: builder.mutation({
      query: (id) => ({
        url: `/api/QuizResult/quiz/${id}`,
        method: 'GET',
      }),
      invalidatesTags: ['QuizResult'],
    }),
  }),
});
export const {
  useSubmitQuizMutation,
  useGetQuizResultByUserQuery,
  useGetQuizResultByQuizMutation,
} = teacherApi;
