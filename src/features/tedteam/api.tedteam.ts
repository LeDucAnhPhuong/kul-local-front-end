import { baseApi } from '@/redux/baseApi';
import { getAttendanceByDate } from './teddata';

export const tedTeamScheduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTedTeamScheduleByDateRange: builder.query({
      query: ({ startDate, endDate }) => ({
        url: '/api/Attendance/get-personal',
        method: 'GET',
        params: { startDate, endDate },
      }),
    }),
    getRegisterSchedule: builder.query({
      query: () => ({
        url: '/api/Register/register',
        method: 'GET',
      }),
      providesTags: ['RegisterSchedule'],
    }),
    getAllSlot: builder.query({
      query: () => ({
        url: '/api/Slot/slots',
        method: 'GET',
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
    getClasses: builder.query({
      query: () => `/api/Class/classes`,
      providesTags: ['Class'],
    }),
    getClassInfo: builder.query({
      query: (id) => `/api/Class/${id}`,
      providesTags: ['Class'],
    }),
    getClassDetail: builder.query({
      query: (classId) => `/api/Class/get-member-class/${classId}`,
      providesTags: ['Class'],
    }),
    getAttendanceByDate: builder.query({
      query: ({ startDate, endDate }) => ({
        url: '/api/Attendance/get-personal',
        method: 'GET',
        params: { startDate, endDate },
      }),
    }),
    updateAttendanceStatus: builder.mutation({
      query: ({ user_id, status }) => ({
        url: '/api/Attendance',
        method: 'PUT',
        params: { user_id, status },
      }),
    }),
  }),
});

export const {
  useGetTedTeamScheduleByDateRangeQuery,
  useGetRegisterScheduleQuery,
  useGetAllSlotQuery,
  useRegisterScheduleMutation,
  useUnregisterScheduleMutation,
  useGetClassesQuery,
  useGetClassDetailQuery,
  useGetClassInfoQuery,
  useGetAttendanceByDateQuery,
  useUpdateAttendanceStatusMutation,
} = tedTeamScheduleApi;
