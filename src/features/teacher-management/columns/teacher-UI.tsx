// import type { ColumnDef, Row } from '@tanstack/react-table';
// import { DotsHorizontalIcon } from '@radix-ui/react-icons';
// import { Eye } from 'lucide-react';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { Button } from '@/components/ui/button';
// import { Link } from 'react-router';
// import { Badge } from '@/components/ui/badge';
// import { cn } from '@/lib/utils';
// import { filterDateRange } from '@/utils/table';

// export type User = {
//   id: number;
//   name: string;
//   email: string;
//   status: string;
//   createdAt: string;
// };

// // export const columns: ColumnDef<User>[] = [
// //   {
// //     accessorKey: 'name',
// //     header: 'Tên',
// //     cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
// //   },
// //   {
// //     accessorKey: 'email',
// //     header: 'Email',
// //     cell: ({ row }) => <div>{row.getValue('email')}</div>,
// //   },
// //   {
// //     accessorKey: 'status',
// //     header: 'Trạng thái',
// //     cell: ({ row }) => {
// //       const value: string = row.getValue('status') || '';
// //       return (
// //         <Badge
// //           className={cn(
// //             value === 'active' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600',
// //           )}
// //         >
// //           {value}
// //         </Badge>
// //       );
// //     },
// //     meta: {
// //       filterVariant: 'select',
// //     },
// //   },
// //   {
// //     accessorKey: 'createdAt',
// //     header: 'Ngày tạo',
// //     cell: ({ row }) => {
// //       const createdAt = row.getValue('createdAt');
// //       const formattedDate =
// //         typeof createdAt === 'string' ? new Date(createdAt).toLocaleDateString() : createdAt;
// //       return <div>{`${formattedDate}`}</div>;
// //     },
// //     meta: {
// //       filterVariant: 'numberRange',
// //     },
// //     filterFn: filterDateRange,
// //   },
// //   {
// //     id: 'actions',
// //     cell: ({ row }) => <Action row={row} />,
// //   },
// // ];

// const Action = ({ row }: { row: Row<User> }) => {
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button className="flex h-8 w-8 p-0 data-[state=open]:bg-muted" variant="ghost">
//           <DotsHorizontalIcon className="h-4 w-4" />
//           <span className="sr-only">Open Menu</span>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         <DropdownMenuItem>
//           <Link className="flex gap-2 w-full" to={`/nguoi-dung/${row.original?.id}`}>
//             <Eye className="w-4 h-4 text-blue-500" />
//             <span>Xem</span>
//           </Link>
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// };
