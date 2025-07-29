import { Tabs, TabsContent, TabsList, TabsTrigger }  from '@/components/ui/custom-tabs';
import AllNewsModule  from './AllNewsModule';
import NewsView  from '@/pages/dashboard/student/News/NewsView';

const NewsModule = () => {
return (
<Tabs defaultValue="all_news">
  <TabsList>
    <TabsTrigger value="all_news">All News</TabsTrigger>
    <TabsTrigger value="your_news">Your News</TabsTrigger>
  </TabsList>
  <div className="p-4 bg-white rounded-xl ">
    <TabsContent value="all_news">
    <AllNewsModule />
    </TabsContent>
    <TabsContent value="your_news">
    <NewsView />
    </TabsContent>
  </div>
</Tabs>
);
};

export default NewsModule;
