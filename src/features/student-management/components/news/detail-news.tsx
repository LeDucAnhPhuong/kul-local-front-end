import { useGetNewsByIdQuery } from './news.api';
import { skipToken } from '@reduxjs/toolkit/query';
import { Spinner } from '@/components/ui/spinner';
import { useParams } from 'react-router';
import { Timer } from 'lucide-react';

export default function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { newsItem, isFetching } = useGetNewsByIdQuery(id ? id : skipToken, {
    selectFromResult: ({ data, isFetching }) => ({
      newsItem: data?.data,
      isFetching,
    }),
  });

  return (
    <div className="min-h-screen  bg-white rounded-lg  flex justify-center">
      {isFetching ? (
        <div className="flex items-center justify-center w-full h-screen">
          <Spinner />
        </div>
      ) : (
        <div className="w-full rounded-xl  overflow-hidden">
          {newsItem?.imageUrl ? (
            <div className="relative w-full">
              <img
                src={newsItem?.imageUrl || '/placeholder.svg'}
                alt={newsItem?.title}
                className="rounded-t-xl w-full h-full object-cover"
              />
              <div className="absolute bottom-0 h-[200px] left-0 right-0 bg-gradient-to-t from-gray-600/20 to-bg-white text-white p-4 text-center z-2"></div>
              <div className=" absolute bottom-0 left-5">
                <h1 className="text-[60px] line-clamp-1 font-bold">{newsItem?.title}</h1>
                <div className="flex mb-5 items-center gap-2">
                  <Timer />
                  <p className="text-sm ">
                    Date: {new Date(newsItem?.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative w-full flex items-center justify-center rounded-t-xl">
              <img
                src={`/placeholder.svg?height=400&width=600&query=${encodeURIComponent(
                  newsItem?.title,
                )}`}
                alt={newsItem?.title}
                className="rounded-t-xl opacity-50"
              />
            </div>
          )}
          <div className="p-4 md:p-8">
            <div
              className="prose prose-invert max-w-none leading-relaxed"
              dangerouslySetInnerHTML={{ __html: newsItem?.content }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
