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
    updateRoomMaintenanceStatus: builder.mutation({
      query: ({ id, isActive, note }) => ({
        url: `/api/Room/${id}/maintenance`,
        method: 'PATCH',
        body: {
          isActive,
          note,
          updatedAt: new Date().toISOString(),
          updatedBy: null,
        },
      }),
      invalidatesTags: ['Room'],
    }),
    duplicateRoom: builder.mutation({
      query: ({ id, name }) => ({
        url: `/api/Room/${id}/duplicate`,
        method: 'POST',
        body: {
          name,
          createdAt: new Date().toISOString(),
          createdBy: 'system',
          updatedBy: 'system',
        },
      }),
      invalidatesTags: ['Room'],
    }),
    bulkUpdateRoomCapacity: builder.mutation({
      query: (rooms) => ({
        url: `/api/Room/bulk-capacity`,
        method: 'PUT',
        body: rooms.map((room: { id: string; capacity: number }) => ({
          _id: room.id,
          capacity: room.capacity,
          updatedAt: new Date().toISOString(),
        })),
      }),
      invalidatesTags: ['Room'],
    }),
  }),
});

export const {
  useGetRoomsQuery,
  useGetRoomByIdQuery,
  useCreateRoomMutation,
  useDeleteRoomMutation,
  useUpdateRoomMutation,
  useUpdateRoomMaintenanceStatusMutation,
  useDuplicateRoomMutation,
  useBulkUpdateRoomCapacityMutation,
} = roomApi;
