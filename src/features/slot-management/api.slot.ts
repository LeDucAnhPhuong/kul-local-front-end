import { baseApi } from '@/redux/baseApi';

export const slotApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSlots: builder.query({
      query: () => `/api/Slot/slots`,
      providesTags: ['Slot'],
    }),
    createSlot: builder.mutation({
      query: (newSlot) => ({
        url: `/api/Slot/slots`,
        method: 'POST',
        body: newSlot,
      }),
      invalidatesTags: ['Slot'],
    }),
  }),
});

export const { useGetSlotsQuery, useCreateSlotMutation } = slotApi;
