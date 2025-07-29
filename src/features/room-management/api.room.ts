import { baseApi } from '@/redux/baseApi';

export const roomApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRooms: builder.query({
      query: () => `/api/Room`,
      providesTags: ['Room'],
    }),
    getRoomById: builder.query({
      query: (id) => `/api/Room/${id}`,
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
    deleteRoom: builder.mutation({
      query: (id) => ({
        url: `/api/Room/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Room'],
    }),
    updateRoom: builder.mutation({
      query: ({ id, ...updateRoom }) => ({
        url: `/api/Room/${id}`,
        method: 'PATCH',
        body: updateRoom,
      }),
      invalidatesTags: ['Room'],
    }),
  }),
});

export const { useGetRoomsQuery, useGetRoomByIdQuery, useCreateRoomMutation, useDeleteRoomMutation, useUpdateRoomMutation } = roomApi;
