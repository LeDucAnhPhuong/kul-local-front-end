import { useState } from 'react';
import {
  useGetCoachStaticsQuery,
  useGetQuizResultByQuizIdQuery,
  useGetQuizStaticsQuery,
} from '../../api.teacher';
import QuizDashboardSkeleton from './skeleton-statics';
import QuizDashboard from './coach-statics';
import { skipToken } from '@reduxjs/toolkit/query';

const StaticsCoach = () => {
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  const [selectedQuizIdForScoreDistribution, setSelectedQuizIdForScoreDistribution] = useState<
    string | undefined
  >(undefined);

  const { data, isLoadingStatics } = useGetCoachStaticsQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => ({
      data: data?.data || [],
      isLoadingStatics: isFetching,
    }),
  });

  const { data: quizData, isLoadingQuizStatics } = useGetQuizStaticsQuery(
    selectedClassIds.length
      ? {
          classId: selectedClassIds,
        }
      : skipToken,
    {
      selectFromResult: ({ data, isFetching }) => ({
        data: data?.data || [],
        isLoadingQuizStatics: isFetching,
      }),
    },
  );

  const { data: quizResultData, isLoadingQuizResult } = useGetQuizResultByQuizIdQuery(
    selectedQuizIdForScoreDistribution ?? skipToken,
    {
      selectFromResult: ({ data, isFetching }) => ({
        data: data?.data || [],
        isLoadingQuizResult: isFetching,
      }),
    },
  );

  // const classOptions =
  //   data?.map((item: any) => ({
  //     value: item?.classId,
  //     label: item?.name,
  //   })) || [];

  // const quizOptions =
  //   data?.map((item: any) => ({
  //     value: item?.quizId?.id,
  //     label: item?.quizId?.title,
  //   })) || [];

  const loading = isLoadingStatics || isLoadingQuizStatics || isLoadingQuizResult;
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8">
      {loading ? (
        <QuizDashboardSkeleton />
      ) : (
        <QuizDashboard
          quizData={data}
          quizDataByClass={quizData}
          submissionData={quizResultData}
          setSelectedClassIds={setSelectedClassIds}
          selectedClassIds={selectedClassIds}
          selectedQuizIdForScoreDistribution={selectedQuizIdForScoreDistribution}
          setSelectedQuizIdForScoreDistribution={setSelectedQuizIdForScoreDistribution}
          //   classOptions={classOptions}
        />
      )}
    </div>
  );
};

export default StaticsCoach;
