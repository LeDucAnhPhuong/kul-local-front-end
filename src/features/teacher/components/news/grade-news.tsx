import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { htmlToText } from 'html-to-text';
import { useParams } from 'react-router';
import { skipToken } from '@reduxjs/toolkit/query';
import { useGetNewsByIdQuery, useGradeNewsMutation } from '../../api.teacher';
import { checkingNews, checkingspell } from '@/services/generate-ai';
import CheckingModal from './checking-modal';
import { FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

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

export default function ScorePage() {
  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormData>();
  const [gradeNews] = useGradeNewsMutation();
  const [resultChecking, setResultChecking] = useState<any>(null);
  const [resultSpell, setResultSpell] = useState<any>(null);
  const [visibleSpell, setVisibleSpell] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSpell, setLoadingSpell] = useState(false);
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

  const handleAICheck = async (news: News) => {
    try {
      const plainText = htmlToText(news.content, {
        wordwrap: false,
        selectors: [{ selector: 'a', format: 'inline' }],
      });

      setLoading(true);
      const feedback = await checkingNews(plainText, news?.title);

      const cleaned = feedback?.replace(/```json|```/g, '').trim();

      // Bước 2: Parse thành object
      const result = JSON.parse(cleaned);
      setResultChecking(result);
    } catch (error) {
      console.error('Error checking news with AI:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSpellChecking = async (news: News) => {
    try {
      const plainText = htmlToText(news.content, {
        wordwrap: false,
        selectors: [{ selector: 'a', format: 'inline' }],
      });

      setLoadingSpell(true);
      const feedback = await checkingspell(plainText);

      const cleaned = feedback?.replace(/```json|```/g, '').trim();

      // Bước 2: Parse thành object
      const result = JSON.parse(cleaned);
      setResultSpell(result);
      setVisibleSpell(true);
    } catch (error) {
      console.error('Error checking news with AI:', error);
    } finally {
      setLoadingSpell(false);
    }
  };

  useEffect(() => {
    if (!visibleSpell) {
      setValue('score', '');
      setValue('feedback', '');
    } else if (resultSpell) {
      setValue('score', resultSpell?.score || '');
      setValue('feedback', resultSpell?.feedback || '');
    }
  }, [resultSpell, visibleSpell]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Form */}
      <CheckingModal
        isOpen={!!resultChecking}
        content={resultChecking}
        setOpen={setResultChecking}
      />
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
              <div
                dangerouslySetInnerHTML={{
                  __html: visibleSpell ? resultSpell?.content : news?.content,
                }}
              />
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
            <FormField
              name="score"
              control={control}
              render={({ field }) => (
                <Input
                  id="score"
                  {...field}
                  type="number"
                  max={10}
                  min={0}
                  placeholder="Enter your score here..."
                />
              )}
            />
            {errors.score && <p className="text-red-500 text-sm">{errors.score.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="feedback">Detailed feedback</Label>
            <FormField
              name="feedback"
              control={control}
              render={({ field }) => (
                <Textarea
                  id="feedback"
                  {...field}
                  placeholder="Enter your feedback here..."
                  className="min-h-[120px]"
                />
              )}
            />
            {errors.feedback && <p className="text-red-500 text-sm">{errors.feedback.message}</p>}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => handleAICheck(news)}
            className="w-full"
            isLoading={loading}
          >
            AI Checking
          </Button>
          {resultSpell &&
            (visibleSpell ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setVisibleSpell(false)}
                className="w-full"
                isLoading={loadingSpell}
              >
                Hidden spelling errors
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => setVisibleSpell(true)}
                className="w-full"
                isLoading={loadingSpell}
              >
                Show spelling errors
              </Button>
            ))}
          {!resultSpell && (
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSpellChecking(news)}
              className="w-full"
              isLoading={loadingSpell}
            >
              Spell checking
            </Button>
          )}
          <Button type="submit" className="w-full">
            Submit feedback
          </Button>
        </form>
      </div>

      {/* News display */}
    </div>
  );
}
