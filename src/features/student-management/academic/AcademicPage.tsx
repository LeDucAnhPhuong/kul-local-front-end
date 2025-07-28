'use client';

import { AcademicProgressSkeleton } from './academic-skeleton';
import { AcademicProgress } from './academic-progress';
import { useGetAcademicProgressQuery } from '../api.student';

export default function AcademicPage() {
  const { academicData, isLoading } = useGetAcademicProgressQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => ({
      academicData: data?.data || null,
      isLoading: isFetching,
    }),
  });

  return isLoading ? (
    <AcademicProgressSkeleton />
  ) : (
    academicData && <AcademicProgress data={academicData} />
  );
}