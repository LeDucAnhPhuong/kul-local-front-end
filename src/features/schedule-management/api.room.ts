import { baseApi } from '@/redux/baseApi';

export const roomApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRooms: builder.query({
      query: () => `/api/Room`,
      providesTags: ['Room'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetRoomsQuery,
} = roomApi;
