import { baseApi } from '@/redux/baseApi';

export const scheduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSchedules: builder.query({
      query: () => `/api/Schedule/schedules`,
      providesTags: ['Schedule'],
    }),
    getScheduleDateRange: builder.query({
      query: ({ startDate, endDate }) => ({
        url: `/api/Schedule/schedules/date-range`,
        params: { startDate, endDate },
      }),
    }),
    createSchedule: builder.mutation({
      query: (newSchedule) => ({
        url: `/api/Schedule/schedules`,
        method: 'POST',
        body: newSchedule,
      }),
      invalidatesTags: ['Schedule'],
    }),
    createScheduleAuto: builder.mutation({
      query: (newSchedule) => ({
        url: `/api/Schedule/generate-schedules`,
        method: 'POST',
        body: newSchedule,
      }),
      invalidatesTags: ['Schedule'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetSchedulesQuery,
  useCreateScheduleMutation,
  useCreateScheduleAutoMutation,
  useGetScheduleDateRangeQuery,
} = scheduleApi;
