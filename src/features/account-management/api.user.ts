import { baseApi } from '@/redux/baseApi';

export const pokemonApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdmin: builder.query({
      query: () => `/api/Users/admins`,
    }),
    getStudent: builder.query({
      query: () => `/api/Users/students`,
    }),
    getCoaches: builder.query({
      query: () => `/api/Users/coaches`,
    }),
    getTedTeam: builder.query({
      query: () => `/api/Users/tedteams`,
    }),
    createStudent: builder.mutation({
      query: (newStudent) => ({
        url: `students`,
        method: 'POST',
        body: newStudent,
      }),
    }),
    createCoach: builder.mutation({
      query: (newCoach) => ({
        url: `/coach`,
        method: 'POST',
        body: newCoach,
      }),
    }),
    createTedTeam: builder.mutation({
      query: (newTedTeam) => ({
        url: `/ted-team`,
        method: 'POST',
        body: newTedTeam,
      }),
    }),
    createAdmin: builder.mutation({
      query: (newAdmin) => ({
        url: `/admin`,
        method: 'POST',
        body: newAdmin,
      }),
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
} = pokemonApi;
