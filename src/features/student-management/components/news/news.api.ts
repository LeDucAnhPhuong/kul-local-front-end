import { baseApi } from '@/redux/baseApi';

export const studentScheduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNewsForStudent: builder.query({
      query: () => ({
        url: `/api/News/student`,
        method: 'GET',
      }),
      providesTags: ['News'],
    }),
    createNews: builder.mutation({
      query: (data) => ({
        url: `/api/News`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['News'],
    }),
  }),
});

export const { useGetNewsForStudentQuery, useCreateNewsMutation } = studentScheduleApi;
