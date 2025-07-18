import { baseApi } from '@/redux/baseApi';
export const teacherApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTeacherSchedule: builder.query({
      query: ({ startDate, endDate }) => ({
        url: '/api/Schedule/schedules/personal/date-range',
        method: 'GET',
        params: { startDate, endDate },
      }),
    }),
    getNewsForTeacher: builder.query({
      query: () => ({
        url: '/api/news/coach',
        method: 'GET',
      }),
    }),
    getSlotById: builder.query({
      query: (id: string) => ({
        url: `/api/Slot/slots/${id}`,
        method: 'GET',
      }),
    }),
    getSlots: builder.query({
      query: () => `/api/Slot/slots`,
    }),
    getNewsById: builder.query({
      query: (id: string) => ({
        url: `/api/News/${id}`,
        method: 'GET',
      }),
    }),
    gradeNews: builder.mutation({
      query: (data) => ({
        url: `/api/NewsResult`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});
export const {
  useGetTeacherScheduleQuery,
  useGetSlotByIdQuery,
  useGetSlotsQuery,
  useGetNewsForTeacherQuery,
  useGetNewsByIdQuery,
  useGradeNewsMutation,
} = teacherApi;
