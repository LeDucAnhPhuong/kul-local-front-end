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
    getAllNews: builder.query({
      query: () => ({
        url: `/api/News/get-all`,
        method: 'GET',
      }),
      providesTags: ['News'],
    }),
    getNewsById: builder.query({
      query: (id) => ({
        url: `/api/News/${id}`,
        method: 'GET',
      }),
      providesTags: ['News'],
    }),
  }),
});

export const {
  useGetNewsForStudentQuery,
  useCreateNewsMutation,
  useGetAllNewsQuery,
  useGetNewsByIdQuery,
} = studentScheduleApi;
