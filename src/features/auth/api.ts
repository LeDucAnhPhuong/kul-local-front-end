import { baseApi } from '@/redux/baseApi';

export const pokemonApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRole: builder.query({
      query: () => `/api/Users/get-role`,
    }),
  }),
});

export const { useGetRoleQuery } = pokemonApi;
