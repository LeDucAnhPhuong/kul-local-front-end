import { baseApi } from '@/redux/baseApi';

export const speakingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSpeakingScore: builder.mutation({
      query: (data) => ({
        url: '/api/Speaking',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['speakingScore'],
    }),
    getSpeakingLeaderboard: builder.query({
      query: ({ startDate, endDate }) => ({
        url: '/api/Speaking/leaderboard',
        method: 'GET',
        params: {
          startDate,
          endDate,
        },
      }),
      providesTags: ['speakingScore'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useCreateSpeakingScoreMutation, useGetSpeakingLeaderboardQuery } = speakingApi;
