import type { ColumnDef }  from '@tanstack/react-table';
import type { News }  from '../components/news/News';
import { Calendar, Eye, Trash2, Upload }  from 'lucide-react';
import { formatDate }  from 'date-fns';
import { stripHtml }  from '@/utils/stripHTML';
import {
DropdownMenu,
DropdownMenuContent,
DropdownMenuItem,
DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button }  from '@/components/ui/button';
import { DotsHorizontalIcon }  from '@radix-ui/react-icons';
import useRouter  from '@/hooks/use-router';

export const columns: ColumnDef<News>[] = [
{
  accessorKey: 'imageUrl',
  header: 'Image',
  cell: ({ row }) => (
    <div className="w-16 h-12 overflow-hidden bg-gray-100 rounded">
      {row.original.imageUrl ? (
        <img
          src={row.original.imageUrl || '/placeholder.svg'}
          alt={row.getValue('title')}
          className="object-cover w-full h-full"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full text-gray-400">
          <Upload className="w-4 h-4" />
        </div>
      )}
    </div>
  ),
},
{
  accessorKey: 'title',
  header: 'Title',
  cell: ({ row }) => (
    <div className="max-w-xs font-medium leading-tight" title={row.getValue('title')}>
      {row.getValue('title')}
    </div>
  ),
},
{
  accessorKey: 'content',
  header: 'Content',
  cell: ({ row }) => {
    const content = row.getValue('content') as string;
    const plainText = stripHtml(content);
    return (
      <div className="max-w-xs text-muted-foreground line-clamp-2" title={plainText}>
        {plainText}
      </div>
    );
  },
},
{
  accessorKey: 'createdAt',
  header: 'Date',
  cell: ({ row }) => (
    <div className="flex items-center gap-1 text-sm text-blue-600">
      <Calendar className="w-3 h-3" />
      {formatDate(new Date(row.getValue('createdAt')), 'dd/MM/yyyy')}
    </div>
  ),
},
{
  accessorKey: 'result',
  header: 'Result',
  cell: ({ row }) => {
    const result = row.original.result;
    return result ? (
      <div className="flex flex-col gap-1 text-sm text-green-700">
        <div>
          Score: <strong>{result.score}</strong>
        </div>
        <div className="text-xs text-muted-foreground line-clamp-1" title={result.feedback}>
          Feedback: {result.feedback}
        </div>
      </div>
    ) : (
      <span className="text-sm italic text-gray-400">Not graded</span>
    );
  },
},
{
  id: 'actions',
  cell: ({ row }) => Action(row.original),
},
];

const Action = (news: News) => {
const router = useRouter();

const handleView = (news: News) => {
  router.push(`/news/${news.id}`);
};

return (
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Button variant="ghost" className="w-8 h-8 p-0">
        <DotsHorizontalIcon className="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem onClick={() => handleView(news)}>
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-blue-500" />
          View
        </div>
      </DropdownMenuItem>
      <DropdownMenuItem className="text-red-600">
        <Trash2 className="w-4 h-4 mr-2" />
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
};
