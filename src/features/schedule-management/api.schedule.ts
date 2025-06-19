import { baseApi } from '@/redux/baseApi';

export const scheduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSchedules: builder.query({
      query: () => `/api/Schedule/schedules`,
      providesTags: ['Schedule'],
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
} = scheduleApi;
