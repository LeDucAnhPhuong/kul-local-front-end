import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { useGetAllNewsQuery } from './news.api';
import type { News } from './News';
import useRouter from '@/hooks/use-router';

export default function AllNews() {
  const router = useRouter();

  const { news, loading, isError } = useGetAllNewsQuery(undefined, {
    selectFromResult: ({ data, isLoading, isError }) => ({
      news: data?.data || [],
      loading: isLoading,
      isError,
    }),
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#200040] p-8 text-white flex items-center justify-center">
        <p>Loading news...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#200040] p-8 text-white flex items-center justify-center">
        <p>Error loading news</p>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <p>No news available to display.</p>
      </div>
    );
  }

  const mainNews: News = news[0];

  const fakenews = [...news, ...news];

  const leftSideNews: News[] = fakenews.slice(1, (2 * fakenews?.length) / 3);
  const rightSideNews: News[] = fakenews.slice((2 * fakenews?.length) / 3 + 1, fakenews?.length); // Lấy 2 tin tức tiếp theo cho cột bên phải

  const handleView = (news: News) => {
    router.push(`/news/${news.id}`);
  };

  return (
    <div className="flex columns-2 gap-6 max-w-6xl w-full">
      <div className="w-2/3 h-auto">
        <Card
          onClick={() => handleView(mainNews)}
          className="border-none rounded-lg bg-blue-100 mb-6 overflow-hidden"
        >
          <CardContent className="p-0">
            <div className="relative w-full h-[400px] lg:h-[500px]">
              <img
                src={mainNews?.imageUrl} // Vẫn sử dụng ảnh chính đã cung cấp
                alt={mainNews.title}
                className="rounded-t-xl"
              />
              {/* Overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6"></div>
            </div>
            <CardTitle className="text-3xl font-bold mb-2 px-4 line-clamp-2">
              {mainNews.title}
            </CardTitle>
            <CardDescription className="text-lg line-clamp-1 px-4">
              <div
                style={{ textAlign: 'start' }}
                dangerouslySetInnerHTML={{ __html: mainNews?.content }}
              />
            </CardDescription>
          </CardContent>
        </Card>
        <div className="grid grid-cols-2 gap-6">
          {leftSideNews?.map((newsItem: News) => (
            <Card
              onClick={() => handleView(newsItem)}
              key={newsItem.id}
              className=" border-none rounded-lg overflow-hidden"
            >
              <CardContent className="p-0">
                <div className="relative w-full h-[200px]">
                  <img
                    src={
                      newsItem?.imageUrl ??
                      `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(
                        newsItem.title,
                      )}`
                    }
                    alt={newsItem.title}
                    className="rounded-t-xl"
                  />
                </div>
                <div className="p-4"></div>
                <CardTitle className="text-lg font-semibold mb-1 pl-4 line-clamp-2">
                  {newsItem.title}
                </CardTitle>
                <CardDescription className="text-start text-lg line-clamp-1 pl-4">
                  <div dangerouslySetInnerHTML={{ __html: newsItem?.content }} />
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Side News Cards */}
      <div className="flex flex-1 flex-col gap-6">
        {rightSideNews?.map((newsItem: News) => (
          <Card
            onClick={() => handleView(newsItem)}
            key={newsItem.id}
            className=" border-none rounded-lg overflow-hidden"
          >
            <CardContent className="p-0">
              <div className="relative w-full h-[200px]">
                <img
                  src={
                    newsItem?.imageUrl ??
                    `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(
                      newsItem.title,
                    )}`
                  }
                  alt={newsItem.title}
                  className="rounded-t-xl"
                />
              </div>
              <div className="p-4"></div>
              <CardTitle className="text-lg font-semibold mb-1 pl-4 line-clamp-2">
                {newsItem.title}
              </CardTitle>
              <CardDescription className="text-start text-lg line-clamp-1 pl-4">
                <div dangerouslySetInnerHTML={{ __html: newsItem?.content }} />
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
