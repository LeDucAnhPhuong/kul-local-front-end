import { baseApi } from '@/redux/baseApi';

export const studentScheduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLeaderBoard: builder.query({
      query: ({ startDate, endDate }) => ({
        url: `/api/QuizResult/leaderboard`,
        method: 'GET',
        params: { startDate, endDate },
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetLeaderBoardQuery } = studentScheduleApi;
