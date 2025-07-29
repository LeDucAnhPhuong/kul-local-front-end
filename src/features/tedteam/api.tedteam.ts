import { baseApi } from '@/redux/baseApi';

export const tedTeamScheduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClasses: builder.query({
      query: () => `/api/Class/classes`,
      providesTags: ['Class'],
    }),
    getClassInfo: builder.query({
      query: (id) => `/api/Class/${id}`,
      providesTags: ['Class'],
    }),
    getClassForTedteam: builder.query({
      query: () => ({
        url: '/api/Class/get-class-for-tedteam',
        method: 'GET',
      }),
    }),
    getAllSlot: builder.query({
      query: () => ({
        url: '/api/Slot/slots',
        method: 'GET',
      }),
    }),
    getRegisterSchedule: builder.query({
      query: () => ({
        url: '/api/Register/register',
        method: 'GET',
      }),
      providesTags: ['RegisterSchedule'],
    }),
    getTedTeamScheduleByDateRange: builder.query({
      query: ({ startDate, endDate }) => ({
        url: '/api/Attendance/get-personal',
        method: 'GET',
        params: { startDate, endDate },
      }),
    }),
    registerSchedule: builder.mutation({
      query: (data) => ({
        url: '/api/Register/register',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['RegisterSchedule'],
    }),
    unregisterSchedule: builder.mutation({
      query: (data) => ({
        url: '/api/Register/unregister',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['RegisterSchedule'],
    }),
    updateAttendanceStatus: builder.mutation({
      query: (data) => ({
        url: '/api/Attendance',
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetClassesQuery,
  useGetClassInfoQuery,
  useGetClassForTedteamQuery,
  useGetAllSlotQuery,
  useGetRegisterScheduleQuery,
  useGetTedTeamScheduleByDateRangeQuery,
  useRegisterScheduleMutation,
  useUnregisterScheduleMutation,
  useUpdateAttendanceStatusMutation,
} = tedTeamScheduleApi;
