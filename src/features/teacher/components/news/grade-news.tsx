import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { useGetNewsForStudentQuery } from '@/features/student-management/components/news/news.api';
import { useParams } from 'react-router';
import { skipToken } from '@reduxjs/toolkit/query';
import { useGetNewsByIdQuery, useGradeNewsMutation } from '../../api.teacher';

type FormData = {
  name: string;
  score: string;
  feedback: string;
};

type News = {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  class_id: number;
  user_id: number;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
};

const mockNews: News[] = [
  {
    id: 1,
    title: 'Thông báo cuộc thi học thuật',
    content: 'Cuộc thi sẽ diễn ra vào ngày 20/7. Hãy chuẩn bị kỹ càng!',
    imageUrl: 'https://source.unsplash.com/random/400x200?education',
    class_id: 1,
    user_id: 1,
    isActive: true,
    createdBy: 'admin',
    updatedBy: 'admin',
    createdAt: '2025-07-01',
    updatedAt: '2025-07-01',
  },
  {
    id: 2,
    title: 'Cập nhật tài liệu mới',
    content: 'Tài liệu học tập đã được cập nhật trong hệ thống.',
    class_id: 1,
    user_id: 1,
    isActive: true,
    createdBy: 'admin',
    updatedBy: 'admin',
    createdAt: '2025-07-02',
    updatedAt: '2025-07-02',
  },
];

export default function ScorePage() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);
  const [gradeNews, { isLoading: isGrading }] = useGradeNewsMutation();
  const { id } = useParams<{ id: string }>();
  const { news } = useGetNewsByIdQuery(id ?? skipToken, {
    selectFromResult: ({ data }) => ({
      news: data?.data || null,
    }),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await gradeNews({ NewsId: id, score: Number(data.score), feedback: data.feedback }).unwrap();
    } catch (error) {
      console.error('Error grading news:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Form */}
      <div className="space-y-4">
        <Card key={news?.id}>
          <CardContent className="p-4 space-y-2">
            {news?.imageUrl && (
              <img
                src={news?.imageUrl}
                alt={news?.title}
                className="w-full h-40 object-cover rounded-md"
              />
            )}
            <h3 className="text-lg font-semibold">{news?.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <div dangerouslySetInnerHTML={{ __html: news?.content }} />
            </p>
            <p className="text-xs text-muted-foreground">
              Update: {new Date(news?.updatedAt).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md space-y-6">
        <h2 className="text-xl font-bold">Grade and feedback</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="score">Score</Label>
            <Select
              onValueChange={(value) => setValue('score', value)}
              defaultValue={watch('score')}
            >
              <SelectTrigger id="score">
                <SelectValue placeholder="Choose a score" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(10)].map((_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.score && <p className="text-red-500 text-sm">{errors.score.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="feedback">Detailed feedback</Label>
            <Textarea
              id="feedback"
              {...register('feedback', { required: 'Please enter feedback.' })}
              className="min-h-[120px]"
            />
            {errors.feedback && <p className="text-red-500 text-sm">{errors.feedback.message}</p>}
          </div>

          <Button type="submit" className="w-full">
            Submit feedback
          </Button>
        </form>
      </div>

      {/* News display */}
    </div>
  );
}
