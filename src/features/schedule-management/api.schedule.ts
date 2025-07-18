import { baseApi } from '@/redux/baseApi';

export const scheduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSchedules: builder.query({
      query: () => `/api/Schedule`,
      providesTags: ['Schedule'],
    }),
    getScheduleDateRange: builder.query({
      query: ({ startDate, endDate }) => ({
        url: `/api/Schedule/date-range`,
        params: { startDate, endDate },
      }),
      providesTags: ['Schedule'],
    }),
    updateSchedule: builder.mutation({
      query: ({ id, ...updatedSchedule }) => ({
        url: `/api/Schedule/${id}`,
        method: 'PUT',
        body: updatedSchedule,
      }),
      invalidatesTags: ['Schedule'],
    }),
    createSchedule: builder.mutation({
      query: (newSchedule) => ({
        url: `/api/Schedule`,
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
  useUpdateScheduleMutation,
} = scheduleApi;
