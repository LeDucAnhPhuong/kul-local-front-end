import { baseApi } from '@/redux/baseApi';

export const tedTeamScheduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    gerAllRegisteredTeams: builder.query({
      query: () => ({
        url: '/api/Register/get-all-registered-teams',
        method: 'GET',
      }),
      providesTags: ['RegisteredTeams'],
    }),
    acceptRegistered: builder.mutation({
      query: (id) => ({
        url: `/api/Register/accept-register-ted-team/${id}`,
        method: 'GET',
      }),
      invalidatesTags: ['RegisteredTeams'],
    }),
    rejectRegistered: builder.mutation({
      query: (id) => ({
        url: `/api/Register/reject-register-ted-team/${id}`,
        method: 'GET',
      }),
      invalidatesTags: ['RegisteredTeams'],
    }),
  }),
});

export const {
  useGerAllRegisteredTeamsQuery,
  useAcceptRegisteredMutation,
  useRejectRegisteredMutation,
} = tedTeamScheduleApi;
