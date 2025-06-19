import { baseApi } from '@/redux/baseApi'

export const tedTeamScheduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTedTeamScheduleByDateRange: builder.query({
      query: ({ startDate, endDate }) => ({
        url: '/api/Schedule/schedules/personal/date-range',
        method: 'GET',
        params: { startDate, endDate },
      }),
    }),
  }),
})

export const {
  useGetTedTeamScheduleByDateRangeQuery,
} = tedTeamScheduleApi