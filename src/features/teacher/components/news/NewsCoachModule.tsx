import DataTable from '@/components/data-table/data-table';
import React from 'react';
import columns from '../../columns/news.columns';
import { useGetNewsForTeacherQuery } from '../../api.teacher';
import type { News } from '@/features/student-management/components/news/News';
import { useNavigate } from 'react-router-dom';

const NewsCoachModule = () => {
  const navigate = useNavigate();

  const { data, isFetching } = useGetNewsForTeacherQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => ({
      data: data?.data || [],
      isFetching,
    }),
  });

  const handleView = (news: News) => navigate(`/grade-news/${news.id}`);
  const handleEdit = (news: News) => navigate(`/grade-news/edit/${news.id}`);
  const handleDelete = (id: string) => console.log('Delete', id);

  const columnsWithActions = React.useMemo(() => {
    return columns({
      handleView,
      handleEdit,
      handleDelete,
    });
  }, [handleView, handleEdit, handleDelete]);

  return (
    <div className="p-6 space-y-6 bg-white rounded-lg">
      <h2 className="text-xl font-semibold">News Assigned to You</h2>
      <DataTable columns={columnsWithActions} data={data} isLoading={isFetching} />
    </div>
  );
};

export default NewsCoachModule;
