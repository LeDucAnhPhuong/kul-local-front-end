import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye, Edit, Trash2, Plus } from 'lucide-react';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import DataTable from '@/components/data-table/data-table';
import { Textarea } from './textarea';

export type News = {
  id: number;
  title: string;
  content: string;
  class_id: number;
  user_id: number;
  isActive: boolean;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
};

const initialNews: News[] = [
  {
    id: 1,
    title: 'Example Title',
    content: 'Some example content for the news...',
    class_id: 101,
    user_id: 5,
    isActive: true,
    created_by: 'admin',
    updated_by: 'admin',
    created_at: '2024-06-01',
    updated_at: '2024-06-01',
  },
];

export default function NewsTable() {
  const [newsData, setNewsData] = useState<News[]>(initialNews);
  const [open, setOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const handleAddNews = () => {
    if (!newTitle.trim() || !newContent.trim()) {
      toast.error('Please fill in both Title and Content');
      return;
    }

    const newNews: News = {
      id: Date.now(),
      title: newTitle,
      content: newContent,
      class_id: 0,
      user_id: 0,
      isActive: true,
      created_by: 'admin',
      updated_by: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setNewsData([newNews, ...newsData]);
    toast.success('News created successfully');
    setOpen(false);
    setNewTitle('');
    setNewContent('');
  };

  const handleDelete = (id: number) => {
    setNewsData(newsData.filter((n) => n.id !== id));
    toast.success('News deleted');
  };

  const columns: ColumnDef<News>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div className="max-w-xs font-medium truncate" title={row.getValue('title')}>
          {row.getValue('title')}
        </div>
      ),
    },
    {
      accessorKey: 'content',
      header: 'Content',
      cell: ({ row }) => (
        <div className="max-w-xs truncate text-muted-foreground" title={row.getValue('content')}>
          {row.getValue('content')}
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-8 h-8 p-0">
              <DotsHorizontalIcon className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link className="flex items-center gap-2" to={`/tin-tuc/${row.original.id}`}>
                <Eye className="w-4 h-4 text-blue-500" />
                View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link className="flex items-center gap-2" to={`/tin-tuc/chinh-sua/${row.original.id}`}>
                <Edit className="w-4 h-4 text-green-500" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(row.original.id)} className="text-red-600">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">News List</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Write News
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Write News</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <Textarea
                placeholder="Content"
                className="min-h-[120px]" // 👈 cho khung content to ra
                value={newContent}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewContent(e.target.value)}
              />
            </div>
            <DialogFooter className="pt-4">
              <Button onClick={handleAddNews}>Submit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <DataTable columns={columns} data={newsData} />
    </div>
  );
}
