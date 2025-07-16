import { Spinner } from '@/components/ui/spinner';
import { useGetRoleQuery } from '@/features/auth/api';
import Leaderboardpage from '../student/leaderboard';

const DashBoardHome = () => {
  const { role, isFetching } = useGetRoleQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => ({
      role: data?.data,
      isFetching,
    }),
  });
  console.log('role', role);
  if (isFetching)
    return (
      <div className="bg-white flex items-center justify-center rounded-lg p-4 w-full min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  return (
    <div className="bg-white rounded-lg w-full p-4 min-h-screen">
      {role === 'Student' && <Leaderboardpage />}
    </div>
  );
};

export default DashBoardHome;
