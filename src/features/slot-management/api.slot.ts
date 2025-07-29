import { baseApi } from '@/redux/baseApi';

export const slotApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSlots: builder.query({
      query: () => `/api/Slot/slots`,
      providesTags: ['Slot'],
    }),
    getSlotById: builder.query({
      query: (id) => `/api/Slot/slot/${id}`,
      providesTags: ['Slot'],
    }),
    createSlot: builder.mutation({
      query: (newSlot) => ({
        url: `/api/Slot/create-slot`,
        method: 'POST',
        body: newSlot,
      }),
      invalidatesTags: ['Slot'],
    }),
    deleteSlot: builder.mutation({
      query: (id) => ({
        url: `/api/Slot/delete-slot/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Slot'],
    }),
    updateSlot: builder.mutation({
      query: ({ id, ...updatedSlot }) => ({
        url: `/api/Slot/update-slot/${id}`,
        method: 'PUT',
        body: updatedSlot,
      }),
      invalidatesTags: ['Slot'],
    }),
  }),
});

export const { useGetSlotsQuery, useGetSlotByIdQuery, useCreateSlotMutation, useDeleteSlotMutation, useUpdateSlotMutation } = slotApi;
