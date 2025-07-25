import { baseApi } from '@/redux/baseApi';

export const roomApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRooms: builder.query({
      query: () => `/api/Room`,
      providesTags: ['Room'],
    }),
    createRoom: builder.mutation({
      query: (newRoom) => ({
        url: `/api/Room`,
        method: 'POST',
        body: newRoom,
      }),
      invalidatesTags: ['Room'],
    }),
  }),
});

export const { useGetRoomsQuery, useCreateRoomMutation } = roomApi;
