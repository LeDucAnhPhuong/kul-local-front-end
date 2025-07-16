import { baseApi } from '@/redux/baseApi';
export const teacherApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitQuiz: builder.mutation({
      query: (data) => ({
        url: `/api/QuizResult/submit`,
        method: 'POST',
        body: data,
      }),
    }),
    getQuizResultByUser: builder.query({
      query: () => ({
        url: `/api/QuizResult/user`,
        method: 'Get',
      }),
    }),
    getQuizResultByQuiz: builder.mutation({
      query: (id) => ({
        url: `/api/QuizResult/quiz/${id}`,
        method: 'GET',
      }),
    }),
  }),
});
export const {
  useSubmitQuizMutation,
  useGetQuizResultByUserQuery,
  useGetQuizResultByQuizMutation,
} = teacherApi;
