import { baseApi } from '@/redux/baseApi';

export const staticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStaticsCoach: builder.query({
      query: ({ startDate, endDate }) => ({
        url: `/api/Academic/coach`,
        method: 'GET',
        params: { startDate, endDate },
      }),
    }),
    getStaticsClass: builder.query({
      query: ({ startDate, endDate }) => ({
        url: `/api/Academic/class`,
        method: 'GET',
        params: { startDate, endDate },
      }),
    }),
    getStaticsDetailClass: builder.query({
      query: ({ classId, startDate, endDate }) => ({
        url: `/api/Academic/class/${classId}`,
        method: 'GET',
        params: { startDate, endDate },
      }),
    }),
    getStaticsDetailCoach: builder.query({
      query: ({ coachId, startDate, endDate }) => ({
        url: `/api/Academic/coach/${coachId}`,
        method: 'GET',
        params: { startDate, endDate },
      }),
    }),
    getStaticsTedTeam: builder.query({
      query: ({ startDate, endDate }) => ({
        url: `/api/Academic/register`,
        method: 'GET',
        params: { startDate, endDate },
      }),
    }),
    getStaticsTedTeamDetail: builder.query({
      query: ({ startDate, endDate, id }) => ({
        url: `/api/Academic/register/personal/${id}`,
        method: 'GET',
        params: { startDate, endDate },
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetStaticsCoachQuery,
  useGetStaticsClassQuery,
  useGetStaticsDetailClassQuery,
  useGetStaticsDetailCoachQuery,
  useGetStaticsTedTeamQuery,
  useGetStaticsTedTeamDetailQuery,
} = staticsApi;
