import { baseApi } from '@/redux/baseApi';

export const classApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClasses: builder.query({
      query: () => `/api/Class/classes`,
      providesTags: ['Class'],
    }),
    getClassInfo: builder.query({
      query: (id) => `/api/Class/classes/${id}`,
      providesTags: ['Class'],
    }),
    getClassDetail: builder.query({
      query: (classId) => `/api/Class/get-member-class/${classId}`,
      providesTags: ['Class'],
    }),
    createClass: builder.mutation({
      query: (newClass) => ({
        url: `/api/Class/classes`,
        method: 'POST',
        body: newClass,
      }),
      invalidatesTags: ['Class'],
    }),
    addStudentToClass: builder.mutation({
      query: ({ classId, email }) => ({
        url: `/api/Class/classes/${classId}/add-member`,
        method: 'POST',
        body: { email },
      }),
      invalidatesTags: ['Class'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetClassesQuery,
  useCreateClassMutation,
  useGetClassInfoQuery,
  useGetClassDetailQuery,
  useAddStudentToClassMutation,

} = classApi;
