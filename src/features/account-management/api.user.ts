import { baseApi } from '@/redux/baseApi';

export const pokemonApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdmin: builder.query({
      query: () => `/api/Users/admins`,
      providesTags: ['User'],
    }),
    getStudent: builder.query({
      query: () => `/api/Users/students`,
      providesTags: ['User'],
    }),
    getCoaches: builder.query({
      query: () => `/api/Users/coaches`,
      providesTags: ['User'],
    }),
    getTedTeam: builder.query({
      query: () => `/api/Users/tedteams`,
      providesTags: ['User'],
    }),
    createStudent: builder.mutation({
      query: (newStudent) => ({
        url: `/api/Users/student`,
        method: 'POST',
        body: newStudent,
      }),
      invalidatesTags: ['User'],
    }),
    createCoach: builder.mutation({
      query: (newCoach) => ({
        url: `/api/Users/coach`,
        method: 'POST',
        body: newCoach,
      }),
      invalidatesTags: ['User'],
    }),
    createTedTeam: builder.mutation({
      query: (newTedTeam) => ({
        url: `/api/Users/ted-team`,
        method: 'POST',
        body: newTedTeam,
      }),
      invalidatesTags: ['User'],
    }),
    createAdmin: builder.mutation({
      query: (newAdmin) => ({
        url: `/api/Users/admin`,
        method: 'POST',
        body: newAdmin,
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/api/Users/delete/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAdminQuery,
  useGetStudentQuery,
  useGetCoachesQuery,
  useGetTedTeamQuery,
  useCreateStudentMutation,
  useCreateCoachMutation,
  useCreateTedTeamMutation,
  useCreateAdminMutation,
  useDeleteUserMutation
} = pokemonApi;
